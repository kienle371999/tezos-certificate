convert-contract:
	./backend/smartPyBasic/SmartPy.sh run ./backend/contract/tezos-contract.py 
install-dependencies:
	cd backend && npm install
	cd backend/interact-web && npm install
	cd backend/interact-web/app/Create-PDF && npm install