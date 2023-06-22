"use strict";class e{constructor(){this._hasGDPRConsent=!1,this.cookieExpiry=365,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){e.onDOMContentLoaded()}):e.onDOMContentLoaded()}get inDarkMode(){return e.getColorScheme()==e.VALUE_DARK}set inDarkMode(e){this.setDarkMode(e,!1)}get hasGDPRConsent(){return this._hasGDPRConsent}set hasGDPRConsent(t){if(this._hasGDPRConsent=t,t){let t=e.readCookie(e.DATA_KEY);t&&(e.saveCookie(e.DATA_KEY,"",-1),localStorage.setItem(e.DATA_KEY,t))}else{let t=localStorage.getItem(e.DATA_KEY);t&&(localStorage.removeItem(e.DATA_KEY),e.saveCookie(e.DATA_KEY,t))}}get documentRoot(){return document.getElementsByTagName("html")[0]}static saveCookie(e,t="",o=365){let s="";if(o){let e=new Date;e.setTime(e.getTime()+24*o*36e5),s="; expires="+e.toUTCString()}document.cookie=e+"="+t+s+"; SameSite=Strict; path=/"}saveValue(t,o,s=this.cookieExpiry){this.hasGDPRConsent?e.saveCookie(t,o,s):localStorage.setItem(t,o)}static readCookie(e){let t=e+"=",o=document.cookie.split(";");for(let e=0;e<o.length;e++){let s=o[e].trim();if(s.startsWith(t))return s.substring(t.length)}return""}readValue(t){if(this.hasGDPRConsent)return e.readCookie(t);{let e=localStorage.getItem(t);return e||""}}eraseValue(e){this.hasGDPRConsent?this.saveValue(e,"",-1):localStorage.removeItem(e)}getSavedColorScheme(){let t=this.readValue(e.DATA_KEY);return t||""}getPreferedColorScheme(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?e.VALUE_DARK:window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?e.VALUE_LIGHT:""}setDarkMode(t,o=!0){let s=document.querySelectorAll("[data-"+e.DATA_SELECTOR+"]");if(0==s.length)t?(this.documentRoot.classList.remove(e.CLASS_NAME_LIGHT),this.documentRoot.classList.add(e.CLASS_NAME_DARK)):(this.documentRoot.classList.remove(e.CLASS_NAME_DARK),this.documentRoot.classList.add(e.CLASS_NAME_LIGHT));else for(let o=0;o<s.length;o++)s[o].setAttribute("data-"+e.DATA_SELECTOR,t?e.VALUE_DARK:e.VALUE_LIGHT);o&&this.saveValue(e.DATA_KEY,t?e.VALUE_DARK:e.VALUE_LIGHT)}toggleDarkMode(t=!0){let o;let s=document.querySelector("[data-"+e.DATA_SELECTOR+"]");o=s?s.getAttribute("data-"+e.DATA_SELECTOR)==e.VALUE_DARK:this.documentRoot.classList.contains(e.CLASS_NAME_DARK),this.setDarkMode(!o,t)}resetDarkMode(){this.eraseValue(e.DATA_KEY);let t=this.getPreferedColorScheme();if(t)this.setDarkMode(t==e.VALUE_DARK,!1);else{let t=document.querySelectorAll("[data-"+e.DATA_SELECTOR+"]");if(0==t.length)this.documentRoot.classList.remove(e.CLASS_NAME_LIGHT),this.documentRoot.classList.remove(e.CLASS_NAME_DARK);else for(let o=0;o<t.length;o++)t[o].setAttribute("data-"+e.DATA_SELECTOR,"")}}static getColorScheme(){let o=document.querySelector("[data-"+e.DATA_SELECTOR+"]");if(o){let t=o.getAttribute("data-"+e.DATA_SELECTOR);return t==e.VALUE_DARK||t==e.VALUE_LIGHT?t:""}return t.documentRoot.classList.contains(e.CLASS_NAME_DARK)?e.VALUE_DARK:t.documentRoot.classList.contains(e.CLASS_NAME_LIGHT)?e.VALUE_LIGHT:""}static updatePreferedColorSchemeEvent(){let o=t.getSavedColorScheme();o||(o=t.getPreferedColorScheme())&&t.setDarkMode(o==e.VALUE_DARK,!1)}static onDOMContentLoaded(){let o=t.readValue(e.DATA_KEY);o||(o=e.getColorScheme())||(o=t.getPreferedColorScheme());let s=o==e.VALUE_DARK;t.setDarkMode(s,!1),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){e.updatePreferedColorSchemeEvent()})}}e.DATA_KEY="bs.prefers-color-scheme",e.DATA_SELECTOR="bs-color-scheme",e.VALUE_LIGHT="light",e.VALUE_DARK="dark",e.CLASS_NAME_LIGHT="light",e.CLASS_NAME_DARK="dark";const t=new e;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VyxDQUFDLEVBQUcsQ0FBQyxPQUFPLG9CQUFvQixDQUFDLElBQUksRUFBRSxFQUFTLFNBQUEsQ0FBVSxFQUFTLFFBQWxDLENBQTRDLENBQUEsR0FBSSxDQUFBLEVBQUUsRUFBUyxjQUFBLEVBQUEsR0FBcUIsQ0FBQSxFQUFFLEVBQVMsc0JBQUEsRUFBQSxFQUEyQixJQUFNLEVBQUUsR0FBRyxFQUFTLFVBQXBCLEFBQStCLENBQUEsRUFBUyxXQUFBLENBQVksRUFBRSxDQUFDLEdBQUcsT0FBTyxVQUFBLEVBQVksT0FBTyxVQUFBLENBQVcsZ0NBQWdDLGdCQUFBLENBQWlCLFNBQVUsV0FBVyxFQUFTLDhCQUFULEVBQXlDLEVBQUcsQ0FBQyxDQUFDLEVBQVMsUUFBQSxDQUFTLDBCQUEwQixFQUFTLGFBQUEsQ0FBYyxrQkFBa0IsRUFBUyxXQUFBLENBQVksUUFBUSxFQUFTLFVBQUEsQ0FBVyxPQUFPLEVBQVMsZ0JBQUEsQ0FBaUIsUUFBUSxFQUFTLGVBQUEsQ0FBZ0IsT0FBTyxNQUFNLEVBQVMsSUFBSSIsInNvdXJjZXMiOlsiPGFub24+Iiwibm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC1kYXJrLTUvZGlzdC9qcy9kYXJrbW9kZS5taW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBCb290c3RyYXAtRGFyay01IHYxLjEuMyAoaHR0cHM6Ly92aW5vcm9kcmlndWVzLmdpdGh1Yi5pby9ib290c3RyYXAtZGFyay01LylcbiAqIENvcHlyaWdodCAyMDIxIFZpbm8gUm9kcmlndWVzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS92aW5vcm9kcmlndWVzL2Jvb3RzdHJhcC1kYXJrLTUvYmxvYi9tYWluL0xJQ0VOU0UubWQpXG4gKi8gXCJ1c2Ugc3RyaWN0XCI7XG5jbGFzcyBEYXJrTW9kZSB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5faGFzR0RQUkNvbnNlbnQgPSAhMSwgdGhpcy5jb29raWVFeHBpcnkgPSAzNjUsIFwibG9hZGluZ1wiID09PSBkb2N1bWVudC5yZWFkeVN0YXRlID8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBEYXJrTW9kZS5vbkRPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICAgICAgfSkgOiBEYXJrTW9kZS5vbkRPTUNvbnRlbnRMb2FkZWQoKTtcbiAgICB9XG4gICAgZ2V0IGluRGFya01vZGUoKSB7XG4gICAgICAgIHJldHVybiBEYXJrTW9kZS5nZXRDb2xvclNjaGVtZSgpID09IERhcmtNb2RlLlZBTFVFX0RBUks7XG4gICAgfVxuICAgIHNldCBpbkRhcmtNb2RlKGUpIHtcbiAgICAgICAgdGhpcy5zZXREYXJrTW9kZShlLCAhMSk7XG4gICAgfVxuICAgIGdldCBoYXNHRFBSQ29uc2VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc0dEUFJDb25zZW50O1xuICAgIH1cbiAgICBzZXQgaGFzR0RQUkNvbnNlbnQoZSkge1xuICAgICAgICBpZiAodGhpcy5faGFzR0RQUkNvbnNlbnQgPSBlLCBlKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gRGFya01vZGUucmVhZENvb2tpZShEYXJrTW9kZS5EQVRBX0tFWSk7XG4gICAgICAgICAgICBlICYmIChEYXJrTW9kZS5zYXZlQ29va2llKERhcmtNb2RlLkRBVEFfS0VZLCBcIlwiLCAtMSksIGxvY2FsU3RvcmFnZS5zZXRJdGVtKERhcmtNb2RlLkRBVEFfS0VZLCBlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oRGFya01vZGUuREFUQV9LRVkpO1xuICAgICAgICAgICAgZSAmJiAobG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oRGFya01vZGUuREFUQV9LRVkpLCBEYXJrTW9kZS5zYXZlQ29va2llKERhcmtNb2RlLkRBVEFfS0VZLCBlKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGRvY3VtZW50Um9vdCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaHRtbFwiKVswXTtcbiAgICB9XG4gICAgc3RhdGljIHNhdmVDb29raWUoZSwgbyA9IFwiXCIsIHQgPSAzNjUpIHtcbiAgICAgICAgbGV0IGEgPSBcIlwiO1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgY29uc3QgZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgZS5zZXRUaW1lKGUuZ2V0VGltZSgpICsgMjQgKiB0ICogMzYwMDAwMCksIGEgPSBcIjsgZXhwaXJlcz1cIiArIGUudG9VVENTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBlICsgXCI9XCIgKyBvICsgYSArIFwiOyBTYW1lU2l0ZT1TdHJpY3Q7IHBhdGg9L1wiO1xuICAgIH1cbiAgICBzYXZlVmFsdWUoZSwgbywgdCA9IHRoaXMuY29va2llRXhwaXJ5KSB7XG4gICAgICAgIHRoaXMuaGFzR0RQUkNvbnNlbnQgPyBEYXJrTW9kZS5zYXZlQ29va2llKGUsIG8sIHQpIDogbG9jYWxTdG9yYWdlLnNldEl0ZW0oZSwgbyk7XG4gICAgfVxuICAgIHN0YXRpYyByZWFkQ29va2llKGUpIHtcbiAgICAgICAgY29uc3QgbyA9IGUgKyBcIj1cIiwgdCA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIik7XG4gICAgICAgIGZvcihsZXQgZSA9IDA7IGUgPCB0Lmxlbmd0aDsgZSsrKXtcbiAgICAgICAgICAgIGNvbnN0IGEgPSB0W2VdLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChhLnN0YXJ0c1dpdGgobykpIHJldHVybiBhLnN1YnN0cmluZyhvLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJlYWRWYWx1ZShlKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0dEUFJDb25zZW50KSByZXR1cm4gRGFya01vZGUucmVhZENvb2tpZShlKTtcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgbyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGUpO1xuICAgICAgICAgICAgcmV0dXJuIG8gfHwgXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlcmFzZVZhbHVlKGUpIHtcbiAgICAgICAgdGhpcy5oYXNHRFBSQ29uc2VudCA/IHRoaXMuc2F2ZVZhbHVlKGUsIFwiXCIsIC0xKSA6IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGUpO1xuICAgIH1cbiAgICBnZXRTYXZlZENvbG9yU2NoZW1lKCkge1xuICAgICAgICBjb25zdCBlID0gdGhpcy5yZWFkVmFsdWUoRGFya01vZGUuREFUQV9LRVkpO1xuICAgICAgICByZXR1cm4gZSB8fCBcIlwiO1xuICAgIH1cbiAgICBnZXRQcmVmZXJlZENvbG9yU2NoZW1lKCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXMgPyBEYXJrTW9kZS5WQUxVRV9EQVJLIDogd2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KVwiKS5tYXRjaGVzID8gRGFya01vZGUuVkFMVUVfTElHSFQgOiBcIlwiO1xuICAgIH1cbiAgICBzZXREYXJrTW9kZShlLCBvID0gITApIHtcbiAgICAgICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1cIiArIERhcmtNb2RlLkRBVEFfU0VMRUNUT1IgKyBcIl1cIik7XG4gICAgICAgIGlmICgwID09IHQubGVuZ3RoKSBlID8gKHRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5yZW1vdmUoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCksIHRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5hZGQoRGFya01vZGUuQ0xBU1NfTkFNRV9EQVJLKSkgOiAodGhpcy5kb2N1bWVudFJvb3QuY2xhc3NMaXN0LnJlbW92ZShEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspLCB0aGlzLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QuYWRkKERhcmtNb2RlLkNMQVNTX05BTUVfTElHSFQpKTtcbiAgICAgICAgZWxzZSBmb3IobGV0IG8gPSAwOyBvIDwgdC5sZW5ndGg7IG8rKyl0W29dLnNldEF0dHJpYnV0ZShcImRhdGEtXCIgKyBEYXJrTW9kZS5EQVRBX1NFTEVDVE9SLCBlID8gRGFya01vZGUuVkFMVUVfREFSSyA6IERhcmtNb2RlLlZBTFVFX0xJR0hUKTtcbiAgICAgICAgbyAmJiB0aGlzLnNhdmVWYWx1ZShEYXJrTW9kZS5EQVRBX0tFWSwgZSA/IERhcmtNb2RlLlZBTFVFX0RBUksgOiBEYXJrTW9kZS5WQUxVRV9MSUdIVCk7XG4gICAgfVxuICAgIHRvZ2dsZURhcmtNb2RlKGUgPSAhMCkge1xuICAgICAgICBsZXQgbztcbiAgICAgICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1cIiArIERhcmtNb2RlLkRBVEFfU0VMRUNUT1IgKyBcIl1cIik7XG4gICAgICAgIG8gPSB0ID8gdC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiICsgRGFya01vZGUuREFUQV9TRUxFQ1RPUikgPT0gRGFya01vZGUuVkFMVUVfREFSSyA6IHRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5jb250YWlucyhEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspLCB0aGlzLnNldERhcmtNb2RlKCFvLCBlKTtcbiAgICB9XG4gICAgcmVzZXREYXJrTW9kZSgpIHtcbiAgICAgICAgdGhpcy5lcmFzZVZhbHVlKERhcmtNb2RlLkRBVEFfS0VZKTtcbiAgICAgICAgY29uc3QgZSA9IHRoaXMuZ2V0UHJlZmVyZWRDb2xvclNjaGVtZSgpO1xuICAgICAgICBpZiAoZSkgdGhpcy5zZXREYXJrTW9kZShlID09IERhcmtNb2RlLlZBTFVFX0RBUkssICExKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLVwiICsgRGFya01vZGUuREFUQV9TRUxFQ1RPUiArIFwiXVwiKTtcbiAgICAgICAgICAgIGlmICgwID09IGUubGVuZ3RoKSB0aGlzLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QucmVtb3ZlKERhcmtNb2RlLkNMQVNTX05BTUVfTElHSFQpLCB0aGlzLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QucmVtb3ZlKERhcmtNb2RlLkNMQVNTX05BTUVfREFSSyk7XG4gICAgICAgICAgICBlbHNlIGZvcihsZXQgbyA9IDA7IG8gPCBlLmxlbmd0aDsgbysrKWVbb10uc2V0QXR0cmlidXRlKFwiZGF0YS1cIiArIERhcmtNb2RlLkRBVEFfU0VMRUNUT1IsIFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBnZXRDb2xvclNjaGVtZSgpIHtcbiAgICAgICAgY29uc3QgZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1cIiArIERhcmtNb2RlLkRBVEFfU0VMRUNUT1IgKyBcIl1cIik7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBjb25zdCBvID0gZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiICsgRGFya01vZGUuREFUQV9TRUxFQ1RPUik7XG4gICAgICAgICAgICByZXR1cm4gbyA9PSBEYXJrTW9kZS5WQUxVRV9EQVJLIHx8IG8gPT0gRGFya01vZGUuVkFMVUVfTElHSFQgPyBvIDogXCJcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGFya21vZGUuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5jb250YWlucyhEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspID8gRGFya01vZGUuVkFMVUVfREFSSyA6IGRhcmttb2RlLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QuY29udGFpbnMoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCkgPyBEYXJrTW9kZS5WQUxVRV9MSUdIVCA6IFwiXCI7XG4gICAgfVxuICAgIHN0YXRpYyB1cGRhdGVQcmVmZXJlZENvbG9yU2NoZW1lRXZlbnQoKSB7XG4gICAgICAgIGxldCBlID0gZGFya21vZGUuZ2V0U2F2ZWRDb2xvclNjaGVtZSgpO1xuICAgICAgICBlIHx8IChlID0gZGFya21vZGUuZ2V0UHJlZmVyZWRDb2xvclNjaGVtZSgpLCBlICYmIGRhcmttb2RlLnNldERhcmtNb2RlKGUgPT0gRGFya01vZGUuVkFMVUVfREFSSywgITEpKTtcbiAgICB9XG4gICAgc3RhdGljIG9uRE9NQ29udGVudExvYWRlZCgpIHtcbiAgICAgICAgbGV0IGUgPSBkYXJrbW9kZS5yZWFkVmFsdWUoRGFya01vZGUuREFUQV9LRVkpO1xuICAgICAgICBlIHx8IChlID0gRGFya01vZGUuZ2V0Q29sb3JTY2hlbWUoKSwgZSB8fCAoZSA9IGRhcmttb2RlLmdldFByZWZlcmVkQ29sb3JTY2hlbWUoKSkpO1xuICAgICAgICBjb25zdCBvID0gZSA9PSBEYXJrTW9kZS5WQUxVRV9EQVJLO1xuICAgICAgICBkYXJrbW9kZS5zZXREYXJrTW9kZShvLCAhMSksIHdpbmRvdy5tYXRjaE1lZGlhICYmIHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgRGFya01vZGUudXBkYXRlUHJlZmVyZWRDb2xvclNjaGVtZUV2ZW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbkRhcmtNb2RlLkRBVEFfS0VZID0gXCJicy5wcmVmZXJzLWNvbG9yLXNjaGVtZVwiLCBEYXJrTW9kZS5EQVRBX1NFTEVDVE9SID0gXCJicy1jb2xvci1zY2hlbWVcIiwgRGFya01vZGUuVkFMVUVfTElHSFQgPSBcImxpZ2h0XCIsIERhcmtNb2RlLlZBTFVFX0RBUksgPSBcImRhcmtcIiwgRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCA9IFwibGlnaHRcIiwgRGFya01vZGUuQ0xBU1NfTkFNRV9EQVJLID0gXCJkYXJrXCI7XG5jb25zdCBkYXJrbW9kZSA9IG5ldyBEYXJrTW9kZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096czdRMEZKUXl4SFFVTkVPMEZCUVdFc1RVRkJUVHRKUVVGVExHRkJRV0U3VVVGQlF5eEpRVUZKTEVOQlFVTXNhMEpCUVdkQ0xFTkJRVU1zUjBGQlJTeEpRVUZKTEVOQlFVTXNaVUZCWVN4TFFVRkpMR05CUVZrc1UwRkJVeXhoUVVGWExGTkJRVk1zYVVKQlFXbENMRzlDUVVGdlFqdFpRVUZYTEZOQlFWTTdVVUZCYjBJc1MwRkJTU3hUUVVGVE8wbEJRVzlDTzBsQlFVTXNTVUZCU1N4aFFVRlpPMUZCUVVNc1QwRkJUeXhUUVVGVExHOUNRVUZyUWl4VFFVRlRPMGxCUVZVN1NVRkJReXhKUVVGSkxGZEJRVmNzUTBGQlF5eEZRVUZETzFGQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1IwRkJSU3hEUVVGRE8wbEJRVVU3U1VGQlF5eEpRVUZKTEdsQ1FVRm5RanRSUVVGRExFOUJRVThzU1VGQlNTeERRVUZETzBsQlFXVTdTVUZCUXl4SlFVRkpMR1ZCUVdVc1EwRkJReXhGUVVGRE8xRkJRVU1zU1VGQlJ5eEpRVUZKTEVOQlFVTXNhMEpCUVdkQ0xFZEJRVVVzUjBGQlJUdFpRVUZETEUxQlFVMHNTVUZCUlN4VFFVRlRMRmRCUVZjc1UwRkJVenRaUVVGVkxFdEJRVWtzUTBGQlFTeFRRVUZUTEZkQlFWY3NVMEZCVXl4VlFVRlRMRWxCUVVjc1MwRkJTU3hoUVVGaExGRkJRVkVzVTBGQlV5eFZRVUZUTEVWQlFVTTdVVUZCUlN4UFFVRkxPMWxCUVVNc1RVRkJUU3hKUVVGRkxHRkJRV0VzVVVGQlVTeFRRVUZUTzFsQlFWVXNTMEZCU1N4RFFVRkJMR0ZCUVdFc1YwRkJWeXhUUVVGVExGZEJRVlVzVTBGQlV5eFhRVUZYTEZOQlFWTXNWVUZCVXl4RlFVRkRPMUZCUVVVN1NVRkJRenRKUVVGRExFbEJRVWtzWlVGQll6dFJRVUZETEU5QlFVOHNVMEZCVXl4eFFrRkJjVUlzVDBGQlR5eERRVUZETEVWQlFVVTdTVUZCUVR0SlFVRkRMRTlCUVU4c1YwRkJWeXhEUVVGRExFVkJRVU1zU1VGQlJTeEZRVUZGTEVWQlFVTXNTVUZCUlN4SFFVRkhMRVZCUVVNN1VVRkJReXhKUVVGSkxFbEJRVVU3VVVGQlJ5eEpRVUZITEVkQlFVVTdXVUZCUXl4TlFVRk5MRWxCUVVVc1NVRkJTVHRaUVVGTExFVkJRVVVzVVVGQlVTeEZRVUZGTEZsQlFWVXNTMEZCUnl4SlFVRklMRlZCUVdkQ0xFbEJRVVVzWlVGQllTeEZRVUZGTzFGQlFXRTdVVUZCUXl4VFFVRlRMRk5CUVU4c1NVRkJSU3hOUVVGSkxFbEJRVVVzU1VGQlJUdEpRVUV5UWp0SlFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eEpRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRVZCUVVNN1VVRkJReXhKUVVGSkxFTkJRVU1zYVVKQlFXVXNVMEZCVXl4WFFVRlhMRWRCUVVVc1IwRkJSU3hMUVVGSExHRkJRV0VzVVVGQlVTeEhRVUZGTzBsQlFVVTdTVUZCUXl4UFFVRlBMRmRCUVZjc1EwRkJReXhGUVVGRE8xRkJRVU1zVFVGQlRTeEpRVUZGTEVsQlFVVXNTMEZCU1N4SlFVRkZMRk5CUVZNc1QwRkJUeXhOUVVGTk8xRkJRVXNzU1VGQlNTeEpRVUZKTEVsQlFVVXNSMEZCUlN4SlFVRkZMRVZCUVVVc1VVRkJUeXhKUVVGSk8xbEJRVU1zVFVGQlRTeEpRVUZGTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNN1dVRkJUeXhKUVVGSExFVkJRVVVzVjBGQlZ5eEpRVUZITEU5QlFVOHNSVUZCUlN4VlFVRlZMRVZCUVVVN1VVRkJUenRSUVVGRExFOUJRVTA3U1VGQlJUdEpRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkRPMUZCUVVNc1NVRkJSeXhKUVVGSkxFTkJRVU1zWjBKQlFXVXNUMEZCVHl4VFFVRlRMRmRCUVZjN1VVRkJSenRaUVVGRExFMUJRVTBzU1VGQlJTeGhRVUZoTEZGQlFWRTdXVUZCUnl4UFFVRlBMRXRCUVVjN1VVRkJSVHRKUVVGRE8wbEJRVU1zVjBGQlZ5eERRVUZETEVWQlFVTTdVVUZCUXl4SlFVRkpMRU5CUVVNc2FVSkJRV1VzU1VGQlNTeERRVUZETEZWQlFWVXNSMEZCUlN4SlFVRkhMRTFCUVVrc1lVRkJZU3hYUVVGWE8wbEJRVVU3U1VGQlF5eHpRa0ZCY1VJN1VVRkJReXhOUVVGTkxFbEJRVVVzU1VGQlNTeERRVUZETEZWQlFWVXNVMEZCVXp0UlFVRlZMRTlCUVU4c1MwRkJSenRKUVVGRk8wbEJRVU1zZVVKQlFYZENPMUZCUVVNc1QwRkJUeXhQUVVGUExHTkJRVmtzVDBGQlR5eFhRVUZYTEdkRFFVRm5ReXhWUVVGUkxGTkJRVk1zWVVGQlZ5eFBRVUZQTEdOQlFWa3NUMEZCVHl4WFFVRlhMR2xEUVVGcFF5eFZRVUZSTEZOQlFWTXNZMEZCV1R0SlFVRkZPMGxCUVVNc1dVRkJXU3hEUVVGRExFVkJRVU1zU1VGQlJTeERRVUZETEVOQlFVTXNSVUZCUXp0UlFVRkRMRTFCUVUwc1NVRkJSU3hUUVVGVExHbENRVUZwUWl4WFFVRlRMRk5CUVZNc1owSkJRV003VVVGQlN5eEpRVUZITEV0QlFVY3NSVUZCUlN4UlFVRlBMRWxCUVVjc1EwRkJRU3hKUVVGSkxFTkJRVU1zWVVGQllTeFZRVUZWTEU5QlFVOHNVMEZCVXl4dFFrRkJhMElzU1VGQlNTeERRVUZETEdGQlFXRXNWVUZCVlN4SlFVRkpMRk5CUVZNc1owSkJRV1VzU1VGQlNTeERRVUZCTEVsQlFVa3NRMEZCUXl4aFFVRmhMRlZCUVZVc1QwRkJUeXhUUVVGVExHdENRVUZwUWl4SlFVRkpMRU5CUVVNc1lVRkJZU3hWUVVGVkxFbEJRVWtzVTBGQlV5eHBRa0ZCWjBJN1lVRkJVU3hKUVVGSkxFbEJRVWtzU1VGQlJTeEhRVUZGTEVsQlFVVXNSVUZCUlN4UlFVRlBMRWxCUVVrc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eGhRVUZoTEZWQlFWRXNVMEZCVXl4bFFVRmpMRWxCUVVVc1UwRkJVeXhoUVVGWExGTkJRVk03VVVGQllTeExRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRk5CUVZNc1ZVRkJVeXhKUVVGRkxGTkJRVk1zWVVGQlZ5eFRRVUZUTzBsQlFWazdTVUZCUXl4bFFVRmxMRWxCUVVVc1EwRkJReXhEUVVGRExFVkJRVU03VVVGQlF5eEpRVUZKTzFGQlFVVXNUVUZCVFN4SlFVRkZMRk5CUVZNc1kwRkJZeXhYUVVGVExGTkJRVk1zWjBKQlFXTTdVVUZCU3l4SlFVRkZMRWxCUVVVc1JVRkJSU3hoUVVGaExGVkJRVkVzVTBGQlV5eHJRa0ZCWjBJc1UwRkJVeXhoUVVGWExFbEJRVWtzUTBGQlF5eGhRVUZoTEZWQlFWVXNVMEZCVXl4VFFVRlRMR3RDUVVGcFFpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWRCUVVVN1NVRkJSVHRKUVVGRExHZENRVUZsTzFGQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1UwRkJVenRSUVVGVkxFMUJRVTBzU1VGQlJTeEpRVUZKTEVOQlFVTTdVVUZCZVVJc1NVRkJSeXhIUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEV0QlFVY3NVMEZCVXl4WlFVRlhMRU5CUVVNN1lVRkJUenRaUVVGRExFMUJRVTBzU1VGQlJTeFRRVUZUTEdsQ1FVRnBRaXhYUVVGVExGTkJRVk1zWjBKQlFXTTdXVUZCU3l4SlFVRkhMRXRCUVVjc1JVRkJSU3hSUVVGUExFbEJRVWtzUTBGQlF5eGhRVUZoTEZWQlFWVXNUMEZCVHl4VFFVRlRMRzFDUVVGclFpeEpRVUZKTEVOQlFVTXNZVUZCWVN4VlFVRlZMRTlCUVU4c1UwRkJVenRwUWtGQmMwSXNTVUZCU1N4SlFVRkpMRWxCUVVVc1IwRkJSU3hKUVVGRkxFVkJRVVVzVVVGQlR5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1lVRkJZU3hWUVVGUkxGTkJRVk1zWlVGQll6dFJRVUZITzBsQlFVTTdTVUZCUXl4UFFVRlBMR2xDUVVGblFqdFJRVUZETEUxQlFVMHNTVUZCUlN4VFFVRlRMR05CUVdNc1YwRkJVeXhUUVVGVExHZENRVUZqTzFGQlFVc3NTVUZCUnl4SFFVRkZPMWxCUVVNc1RVRkJUU3hKUVVGRkxFVkJRVVVzWVVGQllTeFZRVUZSTEZOQlFWTTdXVUZCWlN4UFFVRlBMRXRCUVVjc1UwRkJVeXhqUVVGWkxFdEJRVWNzVTBGQlV5eGpRVUZaTEVsQlFVVTdVVUZCUlR0UlFVRkRMRTlCUVU4c1UwRkJVeXhoUVVGaExGVkJRVlVzVTBGQlV5eFRRVUZUTEcxQ1FVRnBRaXhUUVVGVExHRkJRVmNzVTBGQlV5eGhRVUZoTEZWQlFWVXNVMEZCVXl4VFFVRlRMRzlDUVVGclFpeFRRVUZUTEdOQlFWazdTVUZCUlR0SlFVRkRMRTlCUVU4c2FVTkJRV2RETzFGQlFVTXNTVUZCU1N4SlFVRkZMRk5CUVZNN1VVRkJjMElzUzBGQlNTeERRVUZCTEVsQlFVVXNVMEZCVXl3d1FrRkJlVUlzUzBGQlJ5eFRRVUZUTEZsQlFWa3NTMEZCUnl4VFFVRlRMRmxCUVZjc1EwRkJReXhGUVVGRE8wbEJRVVU3U1VGQlF5eFBRVUZQTEhGQ1FVRnZRanRSUVVGRExFbEJRVWtzU1VGQlJTeFRRVUZUTEZWQlFWVXNVMEZCVXp0UlFVRlZMRXRCUVVrc1EwRkJRU3hKUVVGRkxGTkJRVk1zYTBKQlFXbENMRXRCUVVrc1EwRkJRU3hKUVVGRkxGTkJRVk1zZDBKQlFYVkNMRU5CUVVNN1VVRkJSeXhOUVVGTkxFbEJRVVVzUzBGQlJ5eFRRVUZUTzFGQlFWY3NVMEZCVXl4WlFVRlpMRWRCUVVVc1EwRkJReXhKUVVGSExFOUJRVThzWTBGQldTeFBRVUZQTEZkQlFWY3NaME5CUVdkRExHbENRVUZwUWl4VlFVRlZPMWxCUVZjc1UwRkJVenRSUVVGblF6dEpRVUZITzBGQlFVTTdRVUZCUXl4VFFVRlRMRmRCUVZNc01rSkJRVEJDTEZOQlFWTXNaMEpCUVdNc2JVSkJRV3RDTEZOQlFWTXNZMEZCV1N4VFFVRlJMRk5CUVZNc1lVRkJWeXhSUVVGUExGTkJRVk1zYlVKQlFXbENMRk5CUVZFc1UwRkJVeXhyUWtGQlowSTdRVUZCVHl4TlFVRk5MRmRCUVZNc1NVRkJTU0lzSW5OdmRYSmpaWE1pT2xzaWJtOWtaVjl0YjJSMWJHVnpMMkp2YjNSemRISmhjQzFrWVhKckxUVXZaR2x6ZEM5cWN5OWtZWEpyYlc5a1pTNXRhVzR1YW5NaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9oWEc0Z0tpQkNiMjkwYzNSeVlYQXRSR0Z5YXkwMUlIWXhMakV1TXlBb2FIUjBjSE02THk5MmFXNXZjbTlrY21sbmRXVnpMbWRwZEdoMVlpNXBieTlpYjI5MGMzUnlZWEF0WkdGeWF5MDFMeWxjYmlBcUlFTnZjSGx5YVdkb2RDQXlNREl4SUZacGJtOGdVbTlrY21sbmRXVnpYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOTJhVzV2Y205a2NtbG5kV1Z6TDJKdmIzUnpkSEpoY0Mxa1lYSnJMVFV2WW14dllpOXRZV2x1TDB4SlEwVk9VMFV1YldRcFhHNGdLaTljYmx3aWRYTmxJSE4wY21samRGd2lPMk5zWVhOeklFUmhjbXROYjJSbGUyTnZibk4wY25WamRHOXlLQ2w3ZEdocGN5NWZhR0Z6UjBSUVVrTnZibk5sYm5ROUlURXNkR2hwY3k1amIyOXJhV1ZGZUhCcGNuazlNelkxTEZ3aWJHOWhaR2x1WjF3aVBUMDlaRzlqZFcxbGJuUXVjbVZoWkhsVGRHRjBaVDlrYjJOMWJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRndpUkU5TlEyOXVkR1Z1ZEV4dllXUmxaRndpTENobWRXNWpkR2x2YmlncGUwUmhjbXROYjJSbExtOXVSRTlOUTI5dWRHVnVkRXh2WVdSbFpDZ3BmU2twT2tSaGNtdE5iMlJsTG05dVJFOU5RMjl1ZEdWdWRFeHZZV1JsWkNncGZXZGxkQ0JwYmtSaGNtdE5iMlJsS0NsN2NtVjBkWEp1SUVSaGNtdE5iMlJsTG1kbGRFTnZiRzl5VTJOb1pXMWxLQ2s5UFVSaGNtdE5iMlJsTGxaQlRGVkZYMFJCVWt0OWMyVjBJR2x1UkdGeWEwMXZaR1VvWlNsN2RHaHBjeTV6WlhSRVlYSnJUVzlrWlNobExDRXhLWDFuWlhRZ2FHRnpSMFJRVWtOdmJuTmxiblFvS1h0eVpYUjFjbTRnZEdocGN5NWZhR0Z6UjBSUVVrTnZibk5sYm5SOWMyVjBJR2hoYzBkRVVGSkRiMjV6Wlc1MEtHVXBlMmxtS0hSb2FYTXVYMmhoYzBkRVVGSkRiMjV6Wlc1MFBXVXNaU2w3WTI5dWMzUWdaVDFFWVhKclRXOWtaUzV5WldGa1EyOXZhMmxsS0VSaGNtdE5iMlJsTGtSQlZFRmZTMFZaS1R0bEppWW9SR0Z5YTAxdlpHVXVjMkYyWlVOdmIydHBaU2hFWVhKclRXOWtaUzVFUVZSQlgwdEZXU3hjSWx3aUxDMHhLU3hzYjJOaGJGTjBiM0poWjJVdWMyVjBTWFJsYlNoRVlYSnJUVzlrWlM1RVFWUkJYMHRGV1N4bEtTbDlaV3h6Wlh0amIyNXpkQ0JsUFd4dlkyRnNVM1J2Y21GblpTNW5aWFJKZEdWdEtFUmhjbXROYjJSbExrUkJWRUZmUzBWWktUdGxKaVlvYkc5allXeFRkRzl5WVdkbExuSmxiVzkyWlVsMFpXMG9SR0Z5YTAxdlpHVXVSRUZVUVY5TFJWa3BMRVJoY210TmIyUmxMbk5oZG1WRGIyOXJhV1VvUkdGeWEwMXZaR1V1UkVGVVFWOUxSVmtzWlNrcGZYMW5aWFFnWkc5amRXMWxiblJTYjI5MEtDbDdjbVYwZFhKdUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUnpRbmxVWVdkT1lXMWxLRndpYUhSdGJGd2lLVnN3WFgxemRHRjBhV01nYzJGMlpVTnZiMnRwWlNobExHODlYQ0pjSWl4MFBUTTJOU2w3YkdWMElHRTlYQ0pjSWp0cFppaDBLWHRqYjI1emRDQmxQVzVsZHlCRVlYUmxPMlV1YzJWMFZHbHRaU2hsTG1kbGRGUnBiV1VvS1NzeU5DcDBLall3S2pZd0tqRmxNeWtzWVQxY0lqc2daWGh3YVhKbGN6MWNJaXRsTG5SdlZWUkRVM1J5YVc1bktDbDlaRzlqZFcxbGJuUXVZMjl2YTJsbFBXVXJYQ0k5WENJcmJ5dGhLMXdpT3lCVFlXMWxVMmwwWlQxVGRISnBZM1E3SUhCaGRHZzlMMXdpZlhOaGRtVldZV3gxWlNobExHOHNkRDEwYUdsekxtTnZiMnRwWlVWNGNHbHllU2w3ZEdocGN5NW9ZWE5IUkZCU1EyOXVjMlZ1ZEQ5RVlYSnJUVzlrWlM1ellYWmxRMjl2YTJsbEtHVXNieXgwS1Rwc2IyTmhiRk4wYjNKaFoyVXVjMlYwU1hSbGJTaGxMRzhwZlhOMFlYUnBZeUJ5WldGa1EyOXZhMmxsS0dVcGUyTnZibk4wSUc4OVpTdGNJajFjSWl4MFBXUnZZM1Z0Wlc1MExtTnZiMnRwWlM1emNHeHBkQ2hjSWp0Y0lpazdabTl5S0d4bGRDQmxQVEE3WlR4MExteGxibWQwYUR0bEt5c3BlMk52Ym5OMElHRTlkRnRsWFM1MGNtbHRLQ2s3YVdZb1lTNXpkR0Z5ZEhOWGFYUm9LRzhwS1hKbGRIVnliaUJoTG5OMVluTjBjbWx1WnlodkxteGxibWQwYUNsOWNtVjBkWEp1WENKY0luMXlaV0ZrVm1Gc2RXVW9aU2w3YVdZb2RHaHBjeTVvWVhOSFJGQlNRMjl1YzJWdWRDbHlaWFIxY200Z1JHRnlhMDF2WkdVdWNtVmhaRU52YjJ0cFpTaGxLVHQ3WTI5dWMzUWdiejFzYjJOaGJGTjBiM0poWjJVdVoyVjBTWFJsYlNobEtUdHlaWFIxY200Z2IzeDhYQ0pjSW4xOVpYSmhjMlZXWVd4MVpTaGxLWHQwYUdsekxtaGhjMGRFVUZKRGIyNXpaVzUwUDNSb2FYTXVjMkYyWlZaaGJIVmxLR1VzWENKY0lpd3RNU2s2Ykc5allXeFRkRzl5WVdkbExuSmxiVzkyWlVsMFpXMG9aU2w5WjJWMFUyRjJaV1JEYjJ4dmNsTmphR1Z0WlNncGUyTnZibk4wSUdVOWRHaHBjeTV5WldGa1ZtRnNkV1VvUkdGeWEwMXZaR1V1UkVGVVFWOUxSVmtwTzNKbGRIVnliaUJsZkh4Y0lsd2lmV2RsZEZCeVpXWmxjbVZrUTI5c2IzSlRZMmhsYldVb0tYdHlaWFIxY200Z2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFbUpuZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtGd2lLSEJ5WldabGNuTXRZMjlzYjNJdGMyTm9aVzFsT2lCa1lYSnJLVndpS1M1dFlYUmphR1Z6UDBSaGNtdE5iMlJsTGxaQlRGVkZYMFJCVWtzNmQybHVaRzkzTG0xaGRHTm9UV1ZrYVdFbUpuZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtGd2lLSEJ5WldabGNuTXRZMjlzYjNJdGMyTm9aVzFsT2lCc2FXZG9kQ2xjSWlrdWJXRjBZMmhsY3o5RVlYSnJUVzlrWlM1V1FVeFZSVjlNU1VkSVZEcGNJbHdpZlhObGRFUmhjbXROYjJSbEtHVXNiejBoTUNsN1kyOXVjM1FnZEQxa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0Z3aVcyUmhkR0V0WENJclJHRnlhMDF2WkdVdVJFRlVRVjlUUlV4RlExUlBVaXRjSWwxY0lpazdhV1lvTUQwOWRDNXNaVzVuZEdncFpUOG9kR2hwY3k1a2IyTjFiV1Z1ZEZKdmIzUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTaEVZWEpyVFc5a1pTNURURUZUVTE5T1FVMUZYMHhKUjBoVUtTeDBhR2x6TG1SdlkzVnRaVzUwVW05dmRDNWpiR0Z6YzB4cGMzUXVZV1JrS0VSaGNtdE5iMlJsTGtOTVFWTlRYMDVCVFVWZlJFRlNTeWtwT2loMGFHbHpMbVJ2WTNWdFpXNTBVbTl2ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0VSaGNtdE5iMlJsTGtOTVFWTlRYMDVCVFVWZlJFRlNTeWtzZEdocGN5NWtiMk4xYldWdWRGSnZiM1F1WTJ4aGMzTk1hWE4wTG1Ga1pDaEVZWEpyVFc5a1pTNURURUZUVTE5T1FVMUZYMHhKUjBoVUtTazdaV3h6WlNCbWIzSW9iR1YwSUc4OU1EdHZQSFF1YkdWdVozUm9PMjhyS3lsMFcyOWRMbk5sZEVGMGRISnBZblYwWlNoY0ltUmhkR0V0WENJclJHRnlhMDF2WkdVdVJFRlVRVjlUUlV4RlExUlBVaXhsUDBSaGNtdE5iMlJsTGxaQlRGVkZYMFJCVWtzNlJHRnlhMDF2WkdVdVZrRk1WVVZmVEVsSFNGUXBPMjhtSm5Sb2FYTXVjMkYyWlZaaGJIVmxLRVJoY210TmIyUmxMa1JCVkVGZlMwVlpMR1UvUkdGeWEwMXZaR1V1VmtGTVZVVmZSRUZTU3pwRVlYSnJUVzlrWlM1V1FVeFZSVjlNU1VkSVZDbDlkRzluWjJ4bFJHRnlhMDF2WkdVb1pUMGhNQ2w3YkdWMElHODdZMjl1YzNRZ2REMWtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0Z3aVcyUmhkR0V0WENJclJHRnlhMDF2WkdVdVJFRlVRVjlUUlV4RlExUlBVaXRjSWwxY0lpazdiejEwUDNRdVoyVjBRWFIwY21saWRYUmxLRndpWkdGMFlTMWNJaXRFWVhKclRXOWtaUzVFUVZSQlgxTkZURVZEVkU5U0tUMDlSR0Z5YTAxdlpHVXVWa0ZNVlVWZlJFRlNTenAwYUdsekxtUnZZM1Z0Wlc1MFVtOXZkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vUkdGeWEwMXZaR1V1UTB4QlUxTmZUa0ZOUlY5RVFWSkxLU3gwYUdsekxuTmxkRVJoY210TmIyUmxLQ0Z2TEdVcGZYSmxjMlYwUkdGeWEwMXZaR1VvS1h0MGFHbHpMbVZ5WVhObFZtRnNkV1VvUkdGeWEwMXZaR1V1UkVGVVFWOUxSVmtwTzJOdmJuTjBJR1U5ZEdocGN5NW5aWFJRY21WbVpYSmxaRU52Ykc5eVUyTm9aVzFsS0NrN2FXWW9aU2wwYUdsekxuTmxkRVJoY210TmIyUmxLR1U5UFVSaGNtdE5iMlJsTGxaQlRGVkZYMFJCVWtzc0lURXBPMlZzYzJWN1kyOXVjM1FnWlQxa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0Z3aVcyUmhkR0V0WENJclJHRnlhMDF2WkdVdVJFRlVRVjlUUlV4RlExUlBVaXRjSWwxY0lpazdhV1lvTUQwOVpTNXNaVzVuZEdncGRHaHBjeTVrYjJOMWJXVnVkRkp2YjNRdVkyeGhjM05NYVhOMExuSmxiVzkyWlNoRVlYSnJUVzlrWlM1RFRFRlRVMTlPUVUxRlgweEpSMGhVS1N4MGFHbHpMbVJ2WTNWdFpXNTBVbTl2ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0VSaGNtdE5iMlJsTGtOTVFWTlRYMDVCVFVWZlJFRlNTeWs3Wld4elpTQm1iM0lvYkdWMElHODlNRHR2UEdVdWJHVnVaM1JvTzI4ckt5bGxXMjlkTG5ObGRFRjBkSEpwWW5WMFpTaGNJbVJoZEdFdFhDSXJSR0Z5YTAxdlpHVXVSRUZVUVY5VFJVeEZRMVJQVWl4Y0lsd2lLWDE5YzNSaGRHbGpJR2RsZEVOdmJHOXlVMk5vWlcxbEtDbDdZMjl1YzNRZ1pUMWtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0Z3aVcyUmhkR0V0WENJclJHRnlhMDF2WkdVdVJFRlVRVjlUUlV4RlExUlBVaXRjSWwxY0lpazdhV1lvWlNsN1kyOXVjM1FnYnoxbExtZGxkRUYwZEhKcFluVjBaU2hjSW1SaGRHRXRYQ0lyUkdGeWEwMXZaR1V1UkVGVVFWOVRSVXhGUTFSUFVpazdjbVYwZFhKdUlHODlQVVJoY210TmIyUmxMbFpCVEZWRlgwUkJVa3Q4Zkc4OVBVUmhjbXROYjJSbExsWkJURlZGWDB4SlIwaFVQMjg2WENKY0luMXlaWFIxY200Z1pHRnlhMjF2WkdVdVpHOWpkVzFsYm5SU2IyOTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWhFWVhKclRXOWtaUzVEVEVGVFUxOU9RVTFGWDBSQlVrc3BQMFJoY210TmIyUmxMbFpCVEZWRlgwUkJVa3M2WkdGeWEyMXZaR1V1Wkc5amRXMWxiblJTYjI5MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5aEVZWEpyVFc5a1pTNURURUZUVTE5T1FVMUZYMHhKUjBoVUtUOUVZWEpyVFc5a1pTNVdRVXhWUlY5TVNVZElWRHBjSWx3aWZYTjBZWFJwWXlCMWNHUmhkR1ZRY21WbVpYSmxaRU52Ykc5eVUyTm9aVzFsUlhabGJuUW9LWHRzWlhRZ1pUMWtZWEpyYlc5a1pTNW5aWFJUWVhabFpFTnZiRzl5VTJOb1pXMWxLQ2s3Wlh4OEtHVTlaR0Z5YTIxdlpHVXVaMlYwVUhKbFptVnlaV1JEYjJ4dmNsTmphR1Z0WlNncExHVW1KbVJoY210dGIyUmxMbk5sZEVSaGNtdE5iMlJsS0dVOVBVUmhjbXROYjJSbExsWkJURlZGWDBSQlVrc3NJVEVwS1gxemRHRjBhV01nYjI1RVQwMURiMjUwWlc1MFRHOWhaR1ZrS0NsN2JHVjBJR1U5WkdGeWEyMXZaR1V1Y21WaFpGWmhiSFZsS0VSaGNtdE5iMlJsTGtSQlZFRmZTMFZaS1R0bGZId29aVDFFWVhKclRXOWtaUzVuWlhSRGIyeHZjbE5qYUdWdFpTZ3BMR1Y4ZkNobFBXUmhjbXR0YjJSbExtZGxkRkJ5WldabGNtVmtRMjlzYjNKVFkyaGxiV1VvS1NrcE8yTnZibk4wSUc4OVpUMDlSR0Z5YTAxdlpHVXVWa0ZNVlVWZlJFRlNTenRrWVhKcmJXOWtaUzV6WlhSRVlYSnJUVzlrWlNodkxDRXhLU3gzYVc1a2IzY3ViV0YwWTJoTlpXUnBZU1ltZDJsdVpHOTNMbTFoZEdOb1RXVmthV0VvWENJb2NISmxabVZ5Y3kxamIyeHZjaTF6WTJobGJXVTZJR1JoY21zcFhDSXBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9YQ0pqYUdGdVoyVmNJaXdvWm5WdVkzUnBiMjRvS1h0RVlYSnJUVzlrWlM1MWNHUmhkR1ZRY21WbVpYSmxaRU52Ykc5eVUyTm9aVzFsUlhabGJuUW9LWDBwS1gxOVJHRnlhMDF2WkdVdVJFRlVRVjlMUlZrOVhDSmljeTV3Y21WbVpYSnpMV052Ykc5eUxYTmphR1Z0WlZ3aUxFUmhjbXROYjJSbExrUkJWRUZmVTBWTVJVTlVUMUk5WENKaWN5MWpiMnh2Y2kxelkyaGxiV1ZjSWl4RVlYSnJUVzlrWlM1V1FVeFZSVjlNU1VkSVZEMWNJbXhwWjJoMFhDSXNSR0Z5YTAxdlpHVXVWa0ZNVlVWZlJFRlNTejFjSW1SaGNtdGNJaXhFWVhKclRXOWtaUzVEVEVGVFUxOU9RVTFGWDB4SlIwaFVQVndpYkdsbmFIUmNJaXhFWVhKclRXOWtaUzVEVEVGVFUxOU9RVTFGWDBSQlVrczlYQ0prWVhKclhDSTdZMjl1YzNRZ1pHRnlhMjF2WkdVOWJtVjNJRVJoY210TmIyUmxPeUpkTENKdVlXMWxjeUk2VzEwc0luWmxjbk5wYjI0aU9qTXNJbVpwYkdVaU9pSm9hV2RvVTJWMlpYSnBkSGxUYkdGamEwTm9ZVzV1Wld4QmRYUnZiV0YwYjNKZlFYQnBMa2hCVTBoZlVrVkdYMlZsWkRFMU1XWmpOMlE1T1RZMU1XVXVhbk11YldGd0luMD1cbiIsIi8qIVxuICogQm9vdHN0cmFwLURhcmstNSB2MS4xLjMgKGh0dHBzOi8vdmlub3JvZHJpZ3Vlcy5naXRodWIuaW8vYm9vdHN0cmFwLWRhcmstNS8pXG4gKiBDb3B5cmlnaHQgMjAyMSBWaW5vIFJvZHJpZ3Vlc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdmlub3JvZHJpZ3Vlcy9ib290c3RyYXAtZGFyay01L2Jsb2IvbWFpbi9MSUNFTlNFLm1kKVxuICovXG5cInVzZSBzdHJpY3RcIjtjbGFzcyBEYXJrTW9kZXtjb25zdHJ1Y3Rvcigpe3RoaXMuX2hhc0dEUFJDb25zZW50PSExLHRoaXMuY29va2llRXhwaXJ5PTM2NSxcImxvYWRpbmdcIj09PWRvY3VtZW50LnJlYWR5U3RhdGU/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwoZnVuY3Rpb24oKXtEYXJrTW9kZS5vbkRPTUNvbnRlbnRMb2FkZWQoKX0pKTpEYXJrTW9kZS5vbkRPTUNvbnRlbnRMb2FkZWQoKX1nZXQgaW5EYXJrTW9kZSgpe3JldHVybiBEYXJrTW9kZS5nZXRDb2xvclNjaGVtZSgpPT1EYXJrTW9kZS5WQUxVRV9EQVJLfXNldCBpbkRhcmtNb2RlKGUpe3RoaXMuc2V0RGFya01vZGUoZSwhMSl9Z2V0IGhhc0dEUFJDb25zZW50KCl7cmV0dXJuIHRoaXMuX2hhc0dEUFJDb25zZW50fXNldCBoYXNHRFBSQ29uc2VudChlKXtpZih0aGlzLl9oYXNHRFBSQ29uc2VudD1lLGUpe2NvbnN0IGU9RGFya01vZGUucmVhZENvb2tpZShEYXJrTW9kZS5EQVRBX0tFWSk7ZSYmKERhcmtNb2RlLnNhdmVDb29raWUoRGFya01vZGUuREFUQV9LRVksXCJcIiwtMSksbG9jYWxTdG9yYWdlLnNldEl0ZW0oRGFya01vZGUuREFUQV9LRVksZSkpfWVsc2V7Y29uc3QgZT1sb2NhbFN0b3JhZ2UuZ2V0SXRlbShEYXJrTW9kZS5EQVRBX0tFWSk7ZSYmKGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKERhcmtNb2RlLkRBVEFfS0VZKSxEYXJrTW9kZS5zYXZlQ29va2llKERhcmtNb2RlLkRBVEFfS0VZLGUpKX19Z2V0IGRvY3VtZW50Um9vdCgpe3JldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImh0bWxcIilbMF19c3RhdGljIHNhdmVDb29raWUoZSxvPVwiXCIsdD0zNjUpe2xldCBhPVwiXCI7aWYodCl7Y29uc3QgZT1uZXcgRGF0ZTtlLnNldFRpbWUoZS5nZXRUaW1lKCkrMjQqdCo2MCo2MCoxZTMpLGE9XCI7IGV4cGlyZXM9XCIrZS50b1VUQ1N0cmluZygpfWRvY3VtZW50LmNvb2tpZT1lK1wiPVwiK28rYStcIjsgU2FtZVNpdGU9U3RyaWN0OyBwYXRoPS9cIn1zYXZlVmFsdWUoZSxvLHQ9dGhpcy5jb29raWVFeHBpcnkpe3RoaXMuaGFzR0RQUkNvbnNlbnQ/RGFya01vZGUuc2F2ZUNvb2tpZShlLG8sdCk6bG9jYWxTdG9yYWdlLnNldEl0ZW0oZSxvKX1zdGF0aWMgcmVhZENvb2tpZShlKXtjb25zdCBvPWUrXCI9XCIsdD1kb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpO2ZvcihsZXQgZT0wO2U8dC5sZW5ndGg7ZSsrKXtjb25zdCBhPXRbZV0udHJpbSgpO2lmKGEuc3RhcnRzV2l0aChvKSlyZXR1cm4gYS5zdWJzdHJpbmcoby5sZW5ndGgpfXJldHVyblwiXCJ9cmVhZFZhbHVlKGUpe2lmKHRoaXMuaGFzR0RQUkNvbnNlbnQpcmV0dXJuIERhcmtNb2RlLnJlYWRDb29raWUoZSk7e2NvbnN0IG89bG9jYWxTdG9yYWdlLmdldEl0ZW0oZSk7cmV0dXJuIG98fFwiXCJ9fWVyYXNlVmFsdWUoZSl7dGhpcy5oYXNHRFBSQ29uc2VudD90aGlzLnNhdmVWYWx1ZShlLFwiXCIsLTEpOmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGUpfWdldFNhdmVkQ29sb3JTY2hlbWUoKXtjb25zdCBlPXRoaXMucmVhZFZhbHVlKERhcmtNb2RlLkRBVEFfS0VZKTtyZXR1cm4gZXx8XCJcIn1nZXRQcmVmZXJlZENvbG9yU2NoZW1lKCl7cmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhJiZ3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIikubWF0Y2hlcz9EYXJrTW9kZS5WQUxVRV9EQVJLOndpbmRvdy5tYXRjaE1lZGlhJiZ3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogbGlnaHQpXCIpLm1hdGNoZXM/RGFya01vZGUuVkFMVUVfTElHSFQ6XCJcIn1zZXREYXJrTW9kZShlLG89ITApe2NvbnN0IHQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IrXCJdXCIpO2lmKDA9PXQubGVuZ3RoKWU/KHRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5yZW1vdmUoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCksdGhpcy5kb2N1bWVudFJvb3QuY2xhc3NMaXN0LmFkZChEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspKToodGhpcy5kb2N1bWVudFJvb3QuY2xhc3NMaXN0LnJlbW92ZShEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspLHRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5hZGQoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCkpO2Vsc2UgZm9yKGxldCBvPTA7bzx0Lmxlbmd0aDtvKyspdFtvXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IsZT9EYXJrTW9kZS5WQUxVRV9EQVJLOkRhcmtNb2RlLlZBTFVFX0xJR0hUKTtvJiZ0aGlzLnNhdmVWYWx1ZShEYXJrTW9kZS5EQVRBX0tFWSxlP0RhcmtNb2RlLlZBTFVFX0RBUks6RGFya01vZGUuVkFMVUVfTElHSFQpfXRvZ2dsZURhcmtNb2RlKGU9ITApe2xldCBvO2NvbnN0IHQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IrXCJdXCIpO289dD90LmdldEF0dHJpYnV0ZShcImRhdGEtXCIrRGFya01vZGUuREFUQV9TRUxFQ1RPUik9PURhcmtNb2RlLlZBTFVFX0RBUks6dGhpcy5kb2N1bWVudFJvb3QuY2xhc3NMaXN0LmNvbnRhaW5zKERhcmtNb2RlLkNMQVNTX05BTUVfREFSSyksdGhpcy5zZXREYXJrTW9kZSghbyxlKX1yZXNldERhcmtNb2RlKCl7dGhpcy5lcmFzZVZhbHVlKERhcmtNb2RlLkRBVEFfS0VZKTtjb25zdCBlPXRoaXMuZ2V0UHJlZmVyZWRDb2xvclNjaGVtZSgpO2lmKGUpdGhpcy5zZXREYXJrTW9kZShlPT1EYXJrTW9kZS5WQUxVRV9EQVJLLCExKTtlbHNle2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IrXCJdXCIpO2lmKDA9PWUubGVuZ3RoKXRoaXMuZG9jdW1lbnRSb290LmNsYXNzTGlzdC5yZW1vdmUoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCksdGhpcy5kb2N1bWVudFJvb3QuY2xhc3NMaXN0LnJlbW92ZShEYXJrTW9kZS5DTEFTU19OQU1FX0RBUkspO2Vsc2UgZm9yKGxldCBvPTA7bzxlLmxlbmd0aDtvKyspZVtvXS5zZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IsXCJcIil9fXN0YXRpYyBnZXRDb2xvclNjaGVtZSgpe2NvbnN0IGU9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IrXCJdXCIpO2lmKGUpe2NvbnN0IG89ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK0RhcmtNb2RlLkRBVEFfU0VMRUNUT1IpO3JldHVybiBvPT1EYXJrTW9kZS5WQUxVRV9EQVJLfHxvPT1EYXJrTW9kZS5WQUxVRV9MSUdIVD9vOlwiXCJ9cmV0dXJuIGRhcmttb2RlLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QuY29udGFpbnMoRGFya01vZGUuQ0xBU1NfTkFNRV9EQVJLKT9EYXJrTW9kZS5WQUxVRV9EQVJLOmRhcmttb2RlLmRvY3VtZW50Um9vdC5jbGFzc0xpc3QuY29udGFpbnMoRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVCk/RGFya01vZGUuVkFMVUVfTElHSFQ6XCJcIn1zdGF0aWMgdXBkYXRlUHJlZmVyZWRDb2xvclNjaGVtZUV2ZW50KCl7bGV0IGU9ZGFya21vZGUuZ2V0U2F2ZWRDb2xvclNjaGVtZSgpO2V8fChlPWRhcmttb2RlLmdldFByZWZlcmVkQ29sb3JTY2hlbWUoKSxlJiZkYXJrbW9kZS5zZXREYXJrTW9kZShlPT1EYXJrTW9kZS5WQUxVRV9EQVJLLCExKSl9c3RhdGljIG9uRE9NQ29udGVudExvYWRlZCgpe2xldCBlPWRhcmttb2RlLnJlYWRWYWx1ZShEYXJrTW9kZS5EQVRBX0tFWSk7ZXx8KGU9RGFya01vZGUuZ2V0Q29sb3JTY2hlbWUoKSxlfHwoZT1kYXJrbW9kZS5nZXRQcmVmZXJlZENvbG9yU2NoZW1lKCkpKTtjb25zdCBvPWU9PURhcmtNb2RlLlZBTFVFX0RBUks7ZGFya21vZGUuc2V0RGFya01vZGUobywhMSksd2luZG93Lm1hdGNoTWVkaWEmJndpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsKGZ1bmN0aW9uKCl7RGFya01vZGUudXBkYXRlUHJlZmVyZWRDb2xvclNjaGVtZUV2ZW50KCl9KSl9fURhcmtNb2RlLkRBVEFfS0VZPVwiYnMucHJlZmVycy1jb2xvci1zY2hlbWVcIixEYXJrTW9kZS5EQVRBX1NFTEVDVE9SPVwiYnMtY29sb3Itc2NoZW1lXCIsRGFya01vZGUuVkFMVUVfTElHSFQ9XCJsaWdodFwiLERhcmtNb2RlLlZBTFVFX0RBUks9XCJkYXJrXCIsRGFya01vZGUuQ0xBU1NfTkFNRV9MSUdIVD1cImxpZ2h0XCIsRGFya01vZGUuQ0xBU1NfTkFNRV9EQVJLPVwiZGFya1wiO2NvbnN0IGRhcmttb2RlPW5ldyBEYXJrTW9kZTsiXSwibmFtZXMiOlsiRGFya01vZGUiLCJjb25zdHJ1Y3RvciIsIl9oYXNHRFBSQ29uc2VudCIsImNvb2tpZUV4cGlyeSIsImRvY3VtZW50IiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbkRPTUNvbnRlbnRMb2FkZWQiLCJpbkRhcmtNb2RlIiwiZ2V0Q29sb3JTY2hlbWUiLCJWQUxVRV9EQVJLIiwiZSIsInNldERhcmtNb2RlIiwiaGFzR0RQUkNvbnNlbnQiLCJyZWFkQ29va2llIiwiREFUQV9LRVkiLCJzYXZlQ29va2llIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiZG9jdW1lbnRSb290IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJvIiwidCIsImEiLCJEYXRlIiwic2V0VGltZSIsImdldFRpbWUiLCJ0b1VUQ1N0cmluZyIsImNvb2tpZSIsInNhdmVWYWx1ZSIsInNwbGl0IiwibGVuZ3RoIiwidHJpbSIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJyZWFkVmFsdWUiLCJlcmFzZVZhbHVlIiwiZ2V0U2F2ZWRDb2xvclNjaGVtZSIsImdldFByZWZlcmVkQ29sb3JTY2hlbWUiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsIlZBTFVFX0xJR0hUIiwicXVlcnlTZWxlY3RvckFsbCIsIkRBVEFfU0VMRUNUT1IiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJDTEFTU19OQU1FX0xJR0hUIiwiYWRkIiwiQ0xBU1NfTkFNRV9EQVJLIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlRGFya01vZGUiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiY29udGFpbnMiLCJyZXNldERhcmtNb2RlIiwiZGFya21vZGUiLCJ1cGRhdGVQcmVmZXJlZENvbG9yU2NoZW1lRXZlbnQiXSwidmVyc2lvbiI6MywiZmlsZSI6ImhpZ2hTZXZlcml0eVNsYWNrQ2hhbm5lbEF1dG9tYXRvcl9BcGkuSEFTSF9SRUZfZWVkMTUxZmM3ZDk5NjUxZS5qcy5tYXAifQ==