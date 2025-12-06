#!/bin/bash

# =============================================================================
# MONOREPO AUTO-DETECTION & RAILWAY DEPLOYMENT SCRIPT
# Auto-detects monorepo structure, apps, scripts, and generates Railway config
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DETECTION_REPORT="$REPO_ROOT/.monorepo-detection.json"
APPS=()
declare -A APP_TYPE
declare -A APP_BUILD_CMD
declare -A APP_START_CMD
declare -A APP_PORT

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}MONOREPO AUTO-DETECTION & ANALYSIS${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Detect monorepo type
echo -e "${YELLOW}[1/5] Detecting monorepo type...${NC}"

MONOREPO_TYPE="unknown"
PACKAGE_MANAGER="npm"

if [ -f "$REPO_ROOT/package.json" ]; then
    if grep -q '"workspaces"' "$REPO_ROOT/package.json"; then
        MONOREPO_TYPE="npm-workspaces"
        echo -e "${GREEN}✓ Detected: npm workspaces${NC}"
    fi
    
    if grep -q '"pnpm"' "$REPO_ROOT/package.json"; then
        MONOREPO_TYPE="pnpm-workspaces"
        PACKAGE_MANAGER="pnpm"
        echo -e "${GREEN}✓ Detected: pnpm workspaces${NC}"
    fi
fi

if [ -f "$REPO_ROOT/turbo.json" ]; then
    MONOREPO_TYPE="turborepo"
    echo -e "${GREEN}✓ Detected: Turborepo${NC}"
fi

if [ -f "$REPO_ROOT/nx.json" ] || [ -f "$REPO_ROOT/workspace.json" ]; then
    MONOREPO_TYPE="nx"
    echo -e "${GREEN}✓ Detected: Nx monorepo${NC}"
fi

if [ -f "$REPO_ROOT/yarn.lock" ]; then
    PACKAGE_MANAGER="yarn"
    echo -e "${GREEN}✓ Detected: Yarn package manager${NC}"
fi

echo -e "Monorepo Type: $MONOREPO_TYPE"
echo -e "Package Manager: $PACKAGE_MANAGER\n"

# Step 2: Find all apps/packages
echo -e "${YELLOW}[2/5] Discovering all apps and services...${NC}"

WORKSPACE_PATHS=$(grep -A 100 '"workspaces"' "$REPO_ROOT/package.json" | grep '"' | grep -v 'workspaces' | sed 's/.*"\([^"]*\)".*/\1/' | head -20)

if [ -z "$WORKSPACE_PATHS" ]; then
    echo -e "${RED}No workspaces found in package.json${NC}"
    exit 1
fi

while IFS= read -r workspace_path; do
    if [ -f "$REPO_ROOT/$workspace_path/package.json" ]; then
        APPS+=("$workspace_path")
        echo -e "${GREEN}✓ Found app: $workspace_path${NC}"
    fi
done <<< "$WORKSPACE_PATHS"

if [ ${#APPS[@]} -eq 0 ]; then
    echo -e "${RED}No valid apps found!${NC}"
    exit 1
fi

echo -e "\nTotal apps detected: ${#APPS[@]}\n"

# Step 3: Analyze each app
echo -e "${YELLOW}[3/5] Analyzing each app...${NC}"

for app_path in "${APPS[@]}"; do
    app_name="${app_path##*/}"
    app_package="$REPO_ROOT/$app_path/package.json"
    
    echo -e "\n${BLUE}App: $app_path${NC}"
    
    # Detect build command
    if grep -q '"build"' "$app_package"; then
        BUILD_CMD=$(grep -A 1 '"build"' "$app_package" | tail -1 | sed 's/.*": "\([^"]*\)".*/\1/')
        APP_BUILD_CMD["$app_path"]="$BUILD_CMD"
        echo -e "  Build: ${GREEN}$BUILD_CMD${NC}"
    else
        APP_BUILD_CMD["$app_path"]=""
        echo -e "  Build: ${YELLOW}(none)${NC}"
    fi
    
    # Detect start command
    if grep -q '"start"' "$app_package"; then
        START_CMD=$(grep -A 1 '"start"' "$app_package" | tail -1 | sed 's/.*": "\([^"]*\)".*/\1/')
        APP_START_CMD["$app_path"]="$START_CMD"
        echo -e "  Start: ${GREEN}$START_CMD${NC}"
    else
        START_CMD=$(grep -A 1 '"dev"' "$app_package" | tail -1 | sed 's/.*": "\([^"]*\)".*/\1/')
        APP_START_CMD["$app_path"]="$START_CMD (dev fallback)"
        echo -e "  Start: ${YELLOW}$START_CMD (dev fallback)${NC}"
    fi
    
    # Detect app type (frontend/backend)
    if grep -q '"react"\|"next"\|"vue"\|"vite"' "$app_package"; then
        APP_TYPE["$app_path"]="frontend"
        APP_PORT["$app_path"]="3000"
        echo -e "  Type: ${GREEN}Frontend${NC}"
    else
        APP_TYPE["$app_path"]="backend"
        APP_PORT["$app_path"]="5000"
        echo -e "  Type: ${GREEN}Backend${NC}"
    fi
done

# Step 4: Generate Railway configuration
echo -e "\n${YELLOW}[4/5] Generating Railway configuration...${NC}"

cat > "$REPO_ROOT/railway.toml" << 'EOF'
# =============================================================================
# RAILWAY MONOREPO CONFIGURATION - AUTO-GENERATED
# This file configures Railway to build and deploy your monorepo applications
# =============================================================================

[build]
# Use Nixpacks for intelligent, automatic build detection
builder = "NIXPACKS"

[deploy]
# Default service: Backend Server
startCommand = "npm run start --workspace=server"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

# Environment detection
[env]
NODE_ENV = "production"
EOF

# Step 5: Generate detailed analysis report
echo -e "\n${YELLOW}[5/5] Generating detailed analysis report...${NC}"

cat > "$DETECTION_REPORT" << EOF
{
  "monorepo": {
    "type": "$MONOREPO_TYPE",
    "packageManager": "$PACKAGE_MANAGER",
    "rootPath": "$REPO_ROOT"
  },
  "apps": [
EOF

first=true
for app_path in "${APPS[@]}"; do
    if [ "$first" = false ]; then
        echo "," >> "$DETECTION_REPORT"
    fi
    first=false
    
    cat >> "$DETECTION_REPORT" << APP_JSON
    {
      "path": "$app_path",
      "name": "${app_path##*/}",
      "type": "${APP_TYPE[$app_path]}",
      "port": "${APP_PORT[$app_path]}",
      "buildCommand": "${APP_BUILD_CMD[$app_path]}",
      "startCommand": "${APP_START_CMD[$app_path]}"
    }
APP_JSON
done

cat >> "$DETECTION_REPORT" << 'EOF'
  ]
}
EOF

# Summary Report
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}DETECTION COMPLETE${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Monorepo Type:${NC} $MONOREPO_TYPE"
echo -e "${GREEN}Package Manager:${NC} $PACKAGE_MANAGER"
echo -e "${GREEN}Total Apps:${NC} ${#APPS[@]}\n"

echo -e "${YELLOW}Apps Detected:${NC}"
for app_path in "${APPS[@]}"; do
    echo -e "  • $app_path (${APP_TYPE[$app_path]})"
    echo -e "    Build: ${APP_BUILD_CMD[$app_path]:-'(skipped)'}"
    echo -e "    Start: ${APP_START_CMD[$app_path]}"
    echo -e "    Port: ${APP_PORT[$app_path]}"
done

echo -e "\n${YELLOW}Files Generated:${NC}"
echo -e "  ✓ railway.toml (Railway configuration)"
echo -e "  ✓ .monorepo-detection.json (Detailed analysis)\n"

echo -e "${GREEN}NEXT STEPS:${NC}"
echo -e "  1. Review railway.toml and .monorepo-detection.json"
echo -e "  2. Set environment variables in Railway dashboard"
echo -e "  3. Create separate Railway services for each app (if needed)"
echo -e "  4. For each service, set root directory to app path"
echo -e "  5. Configure build and start commands per service\n"

echo -e "${BLUE}========================================${NC}"
