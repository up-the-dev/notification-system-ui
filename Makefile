
# Docker compose setup (optional, remove if not using)
DC=docker-compose

# CONFIG
PM=npm
 

# FRONTEND TASKS

.PHONY: dev build preview lint lint-fix prettier prettier-fix format install clean help
 
dev:

	@echo "🚀 Starting Vite dev server..."

	$(PM)  start
 
build:

	@echo "📦 Building production bundle..."

	$(PM) run build
 
preview:

	@echo "🔍 Previewing production build..."

	$(PM) run preview
 
lint:

	@echo "🧹 Running ESLint..."

	$(PM) run lint
 
lint-fix:

	@echo "🧹 Running ESLint with fix..."

	$(PM) run lint:fix
 
prettier:

	@echo "✨ Checking Prettier formatting..."

	$(PM) run prettier
 
prettier-fix:

	@echo "✨ Formatting code with Prettier..."

	$(PM) run prettier:fix
 
format:

	@echo "🛠  Running full format (Prettier + ESLint fix)..."

	$(PM) run format
 
install:

	@echo "📦 Installing dependencies..."

	$(PM) install
 
clean:

	@echo "🧼 Cleaning project..."

	rm -rf node_modules dist
 


# HELP

help:

	@echo ""

	@echo "📦  Available Makefile targets:"

	@echo ""

	@echo "  make dev            - Start Vite dev server"

	@echo "  make build          - Build production bundle"

	@echo "  make preview        - Preview production build"

	@echo "  make lint           - Run ESLint"

	@echo "  make lint-fix       - Run ESLint with fix"

	@echo "  make prettier       - Check Prettier formatting"

	@echo "  make prettier-fix   - Fix formatting with Prettier"

	@echo "  make format         - Run Prettier + ESLint fix"

	@echo "  make install        - Install dependencies"

	@echo "  make clean          - Remove node_modules & dist"

	@echo "  make help           - Show this help"

	@echo ""

 