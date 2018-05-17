![](https://avatars3.githubusercontent.com/u/31820267?v=4&s=100)

qiibee Web Wallet
=======================

## [Demo](https://wallet.qiibee.com/)

## Requirements

Node v7.6 or higher

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

**starting the project in dev mode**
```
$ git clone git@bitbucket.org:qiibee/qbwallet.git
$ cd to the root of the project
$ npm install
$ npm start
```
```
access http://localhost:3000
```

**building the project in prod mode**
```
$ git clone git@bitbucket.org:qiibee/qbwallet.git
$ cd to the root of the project
$ npm install
$ npm run build
```
```
set webserver root dir to: /src/ and access http://localhost
```

### How to use Branding

**1. create json file "brandname.json" in /src/branding with the following JSON Object:**
```
{
  "100001": {
    "id":"100001",
    "name":"Brandname",
    "symbol":"BRAND",
    "redirect": "https://www.brandwebpage.com/user"
  }
}
```

**2. create css file "brandname.css" in /src/branding with special design wishes for the Brand:**
```
#header {
  background:#515180 !important; 
}
#top-logo {
  width:120px;
}
.btn, .btn:hover {
  background:#ba8748;
}
```

**Existing Pages**

| File | Information |
| ------ | ------ |
| [index.html](src/index.html) | Mainly used to create / retrieve Wallet |
| [info.html](src/info.html) | Show Wallet informations |
| [mnemonic.html](src/mnemonic.html) | Show Wallet mnemonic phrase |
| [qbexport.html](src/qbexport.html) | qiibee Export to Wallet App |



## License

qiibee Web Wallet is open source and distributed under the Apache License v2.0

  [node.js]: <http://nodejs.org>
  [jQuery]: <http://jquery.com>
  [Gulp]: <http://gulpjs.com>