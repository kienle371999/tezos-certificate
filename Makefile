convert-contract:
	./backend/smartPyBasic/SmartPy.sh run ./backend/contract/tezos-contract.py 
install-dependencies:
	cd backend && rm -rf node_modules && pkg-config --cflags --libs libusb-1.0 && npm install
	cd backend/interact-web && rm -rf node_modules && npm install
	cd backend/interact-web/app/Create-PDF && rm -rf node_modules && npm install