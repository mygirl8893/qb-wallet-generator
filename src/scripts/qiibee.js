"use strict";

var ethers = require('ethers');
var CryptoJS = require("crypto-js");
var $ = require("jquery");
var Wallet = ethers.Wallet;
var mainURL = 'https://wallet.qiibee.com';
var ref = document.referrer;
const DOMPurify = require('dompurify');

module.exports = Qiibee;

function redirectTo(walletAddress) {
    var brandData = JSON.parse(localStorage.getItem("branding"));
    if( brandData !== null) {
        if(walletAddress && typeof brandData.redirect !== "undefined") {
          var redirectRef = brandData.redirect + ( brandData.redirect.match( /[\?]/g ) ? '&' : '?' ) + 'walletAddress=' + walletAddress;
          localStorage.removeItem("branding");
          window.location.replace(redirectRef);
        }else {
          window.location.replace(mainURL + '/info.html');
        }
    } else {
      window.location.replace(mainURL + '/info.html');
    }
}

function redirect(to) {
    var brandData = JSON.parse(localStorage.getItem("branding"));
    if(brandData !== null) {
      localStorage.removeItem("branding");
      window.location.replace(mainURL + to + "?branding=" + brandData.id);
    } else {
      window.location.replace(mainURL + to);
    }
}

function exportTo(wallet) {
   window.location = "qb://?wallet=" + wallet.encrypted;
}

function getAllUrlParams() {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
    while(match = regex.exec(window.location.href)) {
        params[DOMPurify.sanitize(match[1])] = DOMPurify.sanitize(match[2]);
    }
  return params;
}

function doBranding() {
  var urlParams = getAllUrlParams();
  var branding = {};
  if(typeof urlParams.branding !== "undefined" && parseInt(urlParams.branding) > 0) {
    var brandingId = parseInt(urlParams.branding);
    var branding = require("../branding/branding.json")[brandingId];
  }
  
  if(typeof branding.name !== "undefined") {
    localStorage.setItem("branding", JSON.stringify(branding));
    var topLogo = document.getElementById("top-logo");
    var logoLink = document.getElementById("logo-link");
    if(topLogo) {
      topLogo.src = "/images/branding/"+brandingId+"/top-logo.png";
    }
    if(logoLink) {
      logoLink.href = branding.redirect;
    }
    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "/styles/branding/" + branding.name + ".css";
    head.appendChild(link);
    
  }
  $("body").fadeIn();
}

 doBranding();

function Qiibee() {};

Qiibee.prototype.doWork = function() {

  return {
      exportWallet : function (password) {
      var walletStorage = JSON.parse(localStorage.getItem("wallet"))

      try {
        var bytes  = CryptoJS.AES.decrypt(walletStorage.encrypted, password);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      }
      catch(err) {
        return false;
      }
    },
    exportEncryptedWallet : function () {
      var walletStorage = JSON.parse(localStorage.getItem("wallet"));

      return walletStorage;
    },
    findWallet : function () {
      var walletStorage = localStorage.getItem("wallet");
      if(walletStorage) {
        var wallet = JSON.parse(walletStorage);
        return wallet;
      } 
    },
    createWallet : function (password) {
      var wallet = Wallet.createRandom();
      var encryptedAES = CryptoJS.AES.encrypt(JSON.stringify(wallet), password);
      var localStorageObject = {
        address : wallet.address,
        encrypted : encryptedAES.toString()
      }

      localStorage.setItem("wallet", JSON.stringify(localStorageObject));

      return wallet;
    },
    redirectTo : redirectTo,
    redirect : redirect,
    exportTo : exportTo
  }
}
