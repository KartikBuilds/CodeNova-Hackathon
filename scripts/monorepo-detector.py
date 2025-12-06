#!/usr/bin/env python3
"""
Monorepo Auto-Detection & Railway Deployment Configuration
Automatically detects monorepo structure, apps, and generates Railway config
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Colors
RED = '\033[0;31m'
GREEN = '\033[0;32m'
BLUE = '\033[0;34m'
YELLOW = '\033[1;33m'
NC = '\033[0m'

class MonorepoDetector:
    def __init__(self, repo_root: str):
        self.repo_root = Path(repo_root)
        self.monorepo_type = "unknown"
        self.package_manager = "npm"
        self.apps: List[str] = []
        self.app_details: Dict = {}
        
    def print_header(self, text: str):
        print(f"\n{BLUE}{'='*40}{NC}")
        print(f"{BLUE}{text}{NC}")
        print(f"{BLUE}{'='*40}{NC}\n")
    
    def print_success(self, text: str):
        print(f"{GREEN}✓ {text}{NC}")
    
    def print_info(self, text: str):
        print(f"{YELLOW}ℹ {text}{NC}")
    
    def print_error(self, text: str):
        print(f"{RED}✗ {text}{NC}")
    
    def detect_monorepo_type(self):
        """Detect monorepo type and package manager"""
        self.print_info("Detecting monorepo type...")
        
        root_package = self.repo_root / "package.json"
        if not root_package.exists():
            self.print_error("No package.json found")
            return False
        
        with open(root_package) as f:
            pkg = json.load(f)
        
        # Check for workspaces
        if "workspaces" in pkg:
            self.monorepo_type = "npm-workspaces"
            self.print_success("Detected: npm workspaces")
            return True
        
        # Check for other monorepo tools
        if (self.repo_root / "turbo.json").exists():
            self.monorepo_type = "turborepo"
            self.print_success("Detected: Turborepo")
            return True
        
        if (self.repo_root / "nx.json").exists() or (self.repo_root / "workspace.json").exists():
            self.monorepo_type = "nx"
            self.print_success("Detected: Nx monorepo")
            return True
        
        self.print_error("No recognized monorepo type found")
        return False
    
    def discover_apps(self):
        """Find all apps based on workspaces configuration"""
        self.print_info("Discovering apps...")
        
        root_package = self.repo_root / "package.json"
        with open(root_package) as f:
            pkg = json.load(f)
        
        workspaces = pkg.get("workspaces", [])
        if not workspaces:
            self.print_error("No workspaces defined")
            return False
        
        for workspace in workspaces:
            app_path = self.repo_root / workspace
            app_package = app_path / "package.json"
            
            if app_package.exists():
                self.apps.append(workspace)
                self.print_success(f"Found app: {workspace}")
            else:
                self.print_error(f"Workspace {workspace} has no package.json")
        
        if not self.apps:
            self.print_error("No valid apps found")
            return False
        
        print(f"\n{YELLOW}Total apps detected: {len(self.apps)}{NC}\n")
        return True
    
    def analyze_app(self, app_path: str) -> Dict:
        """Analyze a single app's package.json"""
        package_file = self.repo_root / app_path / "package.json"
        
        with open(package_file) as f:
            pkg = json.load(f)
        
        app_name = Path(app_path).name
        scripts = pkg.get("scripts", {})
        deps = pkg.get("dependencies", {})
        dev_deps = pkg.get("devDependencies", {})
        
        # Detect app type
        is_frontend = any(
            lib in deps or lib in dev_deps 
            for lib in ["react", "next", "vue", "vite", "@angular/core", "svelte"]
        )
        
        app_type = "frontend" if is_frontend else "backend"
        port = "3000" if is_frontend else "5000"
        
        # Get commands
        build_cmd = scripts.get("build", "")
        start_cmd = scripts.get("start") or scripts.get("dev", "")
        
        return {
            "path": app_path,
            "name": app_name,
            "type": app_type,
            "port": port,
            "buildCommand": build_cmd,
            "startCommand": start_cmd,
            "hasDatabase": "mongoose" in deps or "prisma" in dev_deps or "sequelize" in deps,
            "hasAuth": "jsonwebtoken" in deps or "passport" in deps,
        }
    
    def analyze_all_apps(self):
        """Analyze all discovered apps"""
        print(f"{YELLOW}[3/5] Analyzing each app...{NC}\n")
        
        for app_path in self.apps:
            details = self.analyze_app(app_path)
            self.app_details[app_path] = details
            
            print(f"{BLUE}App: {app_path}{NC}")
            print(f"  Type: {GREEN}{details['type']}{NC}")
            print(f"  Port: {GREEN}{details['port']}{NC}")
            print(f"  Build: {GREEN}{details['buildCommand'] or '(none)'}{NC}")
            print(f"  Start: {GREEN}{details['startCommand']}{NC}")
            if details['hasDatabase']:
                print(f"  Features: {YELLOW}Database{NC}")
            if details['hasAuth']:
                print(f"  Features: {YELLOW}Authentication{NC}\n")
    
    def generate_railway_config(self):
        """Generate railway.toml configuration"""
        print(f"{YELLOW}[4/5] Generating Railway configuration...{NC}\n")
        
        config_content = f"""# =============================================================================
# RAILWAY MONOREPO CONFIGURATION - AUTO-GENERATED
# Generated by monorepo-detector.py
# Monorepo Type: {self.monorepo_type}
# =============================================================================

[build]
# Use Nixpacks for intelligent build detection
builder = "NIXPACKS"

[deploy]
# Primary service (backend server)
startCommand = "npm run start --workspace=server"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

# =============================================================================
# PER-APP CONFIGURATION
# =============================================================================

# BACKEND SERVER
# Location: server/
# Type: Backend API
# Port: 5000
# Start: npm run start --workspace=server
# Build: (none - Node.js server doesn't require build)

# FRONTEND APP
# Location: apps/client/frontend/
# Type: Frontend (React + Vite)
# Port: 3000
# Start: npm run preview --workspace=apps/client/frontend
# Build: npm run build --workspace=apps/client/frontend

# =============================================================================
# ENVIRONMENT VARIABLES NEEDED
# =============================================================================

[env]
NODE_ENV = "production"
PORT = "5000"

# MongoDB Configuration (if using MongoDB Atlas)
# MONGODB_URI = "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# JWT Secret for authentication
# JWT_SECRET = "your-secret-key"

# API Base URL
# VITE_API_URL = "https://your-railway-app.up.railway.app/api"

# =============================================================================
# DEPLOYMENT INSTRUCTIONS
# =============================================================================

# 1. Set environment variables in Railway dashboard under "Variables"
# 2. Create services:
#    a. Backend service:
#       - Root Directory: /server (or leave empty for monorepo root)
#       - Start Command: npm run start --workspace=server
#       - Port: 5000
#    
#    b. Frontend service (optional):
#       - Root Directory: /apps/client/frontend
#       - Build Command: npm run build
#       - Start Command: npm run preview
#       - Port: 3000

# 3. Deploy via: railway up
"""
        
        config_path = self.repo_root / "railway.toml"
        with open(config_path, "w") as f:
            f.write(config_content)
        
        self.print_success(f"Generated railway.toml")
    
    def generate_detection_report(self):
        """Generate JSON detection report"""
        print(f"{YELLOW}[5/5] Generating detection report...{NC}\n")
        
        report = {
            "monorepo": {
                "type": self.monorepo_type,
                "packageManager": self.package_manager,
                "rootPath": str(self.repo_root),
                "appsCount": len(self.apps),
            },
            "apps": [self.app_details[app_path] for app_path in self.apps]
        }
        
        report_path = self.repo_root / ".monorepo-detection.json"
        with open(report_path, "w") as f:
            json.dump(report, f, indent=2)
        
        self.print_success(f"Generated .monorepo-detection.json")
        return report
    
    def print_summary(self):
        """Print final summary report"""
        self.print_header("DETECTION COMPLETE")
        
        print(f"{GREEN}Monorepo Type:{NC} {self.monorepo_type}")
        print(f"{GREEN}Package Manager:{NC} {self.package_manager}")
        print(f"{GREEN}Total Apps:{NC} {len(self.apps)}\n")
        
        print(f"{YELLOW}Apps Detected:{NC}")
        for app_path in self.apps:
            details = self.app_details[app_path]
            print(f"  • {app_path} ({details['type']})")
            print(f"    Build: {details['buildCommand'] or '(skipped)'}")
            print(f"    Start: {details['startCommand']}")
            print(f"    Port: {details['port']}")
        
        print(f"\n{YELLOW}Files Generated:{NC}")
        print(f"  ✓ railway.toml (Railway configuration)")
        print(f"  ✓ .monorepo-detection.json (Detailed analysis)\n")
        
        print(f"{GREEN}NEXT STEPS:{NC}")
        print(f"  1. Review railway.toml configuration")
        print(f"  2. Set environment variables in Railway dashboard:")
        print(f"     - MONGODB_URI")
        print(f"     - JWT_SECRET")
        print(f"     - VITE_API_URL")
        print(f"  3. For multi-service deployment:")
        print(f"     - Create separate Railway service for frontend")
        print(f"     - Set root directory: /apps/client/frontend")
        print(f"     - Configure build: npm run build")
        print(f"     - Configure start: npm run preview")
        print(f"  4. Deploy: railway up\n")
        
        self.print_header("READY FOR DEPLOYMENT")
    
    def run(self) -> bool:
        """Run full detection process"""
        self.print_header("MONOREPO AUTO-DETECTION & ANALYSIS")
        
        if not self.detect_monorepo_type():
            return False
        
        if not self.discover_apps():
            return False
        
        self.analyze_all_apps()
        self.generate_railway_config()
        self.generate_detection_report()
        self.print_summary()
        
        return True

if __name__ == "__main__":
    repo_root = os.getcwd()
    detector = MonorepoDetector(repo_root)
    
    if detector.run():
        sys.exit(0)
    else:
        sys.exit(1)
