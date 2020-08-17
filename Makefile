convert-contract:
	./backend/smartPyBasic/SmartPy.sh run ./backend/contract/tezos-contract.py 
install-dependencies:
	cd backend && rm -rf node_modules && apt-get install libmagickwand-dev && npm install
	cd backend/interact-web && rm -rf node_modules && npm install
	cd backend/interact-web/app/Create-PDF && rm -rf node_modules && npm install