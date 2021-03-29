window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),define("pat-datagridfield",["jquery","pat-base","pat-registry"],function(a,e,d){return e.extend({name:"datagridfield",trigger:".pat-datagridfield",init:function(){this.el=this.$el[0],this.el_body=this.el.querySelector(".datagridwidget-body"),this.auto_append="false"!==(this.el.dataset.autoAppend||"true").toLowerCase(),this._defineHandler(),this.getVisibleRows().forEach(function(e){this.initRowUI(e)},this),this.ensureMinimumRows()||this.updateOrderIndex(),this.initAutoAppendHandler(),this.el.dispatchEvent(new Event("afterdatagridfieldinit",{bubbles:!0,cancelable:!0}))},_defineHandler:function(){this.handler_auto_append=function(e){e&&e.stopPropagation(),e&&!e.target.closest(".datagridwidget-cell")||this.auto_append_row()}.bind(this),this.handler_auto_append_input=function(e){var t=e.currentTarget;t.classList.remove("auto-append"),t.dataset.oldIndex=t.dataset.index,delete t.dataset.index,this.updateOrderIndex(),t.removeEventListener("input",this.handler_auto_append_input)}.bind(this)},initRowUI:function(t){t.querySelectorAll(".dgf--row-add").forEach(function(e){e.addEventListener("click",function(e){e.preventDefault(),this.insertRow(t),this.updateOrderIndex()}.bind(this))},this),t.querySelectorAll(".dgf--row-delete").forEach(function(e){e.addEventListener("click",function(e){e.preventDefault(),this.removeFieldRow(t)}.bind(this))},this),t.querySelectorAll(".dgf--row-moveup").forEach(function(e){e.addEventListener("click",function(e){e.preventDefault(),this.moveRowUp(t)}.bind(this))},this),t.querySelectorAll(".dgf--row-movedown").forEach(function(e){e.addEventListener("click",function(e){e.preventDefault(),this.moveRowDown(t)}.bind(this))},this)},get_row_buttons:function(e){return{add:e.querySelector(".dgf--row-add"),delete:e.querySelector(".dgf--row-delete"),up:e.querySelector(".dgf--row-moveup"),down:e.querySelector(".dgf--row-movedown")}},setUIState:function(){for(var e=this.getVisibleRows(),t=0;t<e.length;t++){var i=e[t],d=this.get_row_buttons(i);if("AA"===i.dataset.index){if(d.add&&(d.add.disabled=!0),d.delete&&(d.delete.disabled=!0),d.up&&(d.up.disabled=!0),d.down&&(d.down.disabled=!0),0<t){var n=this.get_row_buttons(e[t-1]);n.down&&(n.down.disabled=!0)}}else 0===t?(d.add&&(d.add.disabled=!1),d.delete&&(d.delete.disabled=!1),d.up&&(d.up.disabled=!0),d.down&&(d.down.disabled=1===e.length)):t===e.length-1?(d.add&&(d.add.disabled=!1),d.delete&&(d.delete.disabled=!1),d.up&&(d.up.disabled=!1),d.down&&(d.down.disabled=!0)):(d.add&&(d.add.disabled=!1),d.delete&&(d.delete.disabled=!1),d.up&&(d.up.disabled=!1),d.down&&(d.down.disabled=!1))}},getRows:function(){return this.el_body.querySelectorAll(".datagridwidget-row")},getVisibleRows:function(){return this.el_body.querySelectorAll(".datagridwidget-row:not([data-index=TT])")},getLastRow:function(){return this.el_body.querySelector(".datagridwidget-row:last-child")},getLastVisibleRow:function(){var e=this.el_body.querySelectorAll(".datagridwidget-row:not([data-index=TT])");return e[e.length-1]},countRows:function(){var t=0;return this.getRows().forEach(function(e){-1===["AA","TT"].indexOf(e.dataset.index)&&t++},this),t},initAutoAppendHandler:function(){if(this.auto_append){this.getVisibleRows().forEach(function(e){e.removeEventListener("focusout",this.handler_auto_append)},this);var e=this.getLastVisibleRow();e&&e.addEventListener("focusout",this.handler_auto_append)}},auto_append_row:function(){this.el.dispatchEvent(new Event("beforeaddrowauto")),this.getVisibleRows().forEach(function(e){e.classList.remove("auto-append"),"TT"!==e.dataset.index&&(e.dataset.oldIndex=e.dataset.index,delete e.dataset.index)});var e=this.getLastVisibleRow()||this.getLastRow(),t=this.insertRow(e);t.classList.add("auto-append"),this.reindexRow(t,"AA"),this.updateOrderIndex(),t.addEventListener("input",this.handler_auto_append_input),this.el.dispatchEvent(new Event("afteraddrowauto"))},insertRow:function(e,t){var i=this.createNewRow(),d=a(i);return this.$el.trigger("beforeaddrow",[this.$el,d]),t?d.insertBefore(e):d.insertAfter(e),this.initAutoAppendHandler(),this.$el.trigger("afteraddrow",[this.$el,d]),i},createNewRow:function(){var e=this.el_body.querySelector("[data-index=TT]");if(!e)throw new Error("Could not locate empty template row in DGF");var t=e.cloneNode(!0);t.dataset.oldIndex=t.dataset.index,delete t.dataset.index,t.classList.remove("datagridwidget-empty-row"),this.initRowUI(t);var i=a(t);return i.find('*[class^="dgw-disabled-pat-"]').attr("class",function(e,t){return t.replace(/dgw\-disabled-pat-/,"pat-")}),d.scan(i),t},removeFieldRow:function(e){a(e).remove(),this.ensureMinimumRows()||this.updateOrderIndex(),this.updateOrderIndex(),this.initAutoAppendHandler()},moveRowDown:function(e){this.moveRow(e,"down"),this.updateOrderIndex(),this.initAutoAppendHandler()},moveRowUp:function(e){this.moveRow(e,"up"),this.updateOrderIndex(),this.initAutoAppendHandler()},moveRowToTop:function(e){var t=this.getRows();a(e).insertBefore(t[0]),this.updateOrderIndex(),this.initAutoAppendHandler()},moveRowToBottom:function(e){var t=this.getRows(),i=0;a(t).each(function(e,t){-1===["AA","TT"].indexOf(t.dataset.index)&&(i=e)}),a(e).insertAfter(t[i]),this.updateOrderIndex(),this.initAutoAppendHandler()},moveRow:function(i,e){var t,d=this.getRows(),n=null;if(a(d).each(function(e,t){i===t&&(n=e)}),null!==n){var o=this.countRows();n+1==o?"down"==e?this.moveRowToTop(i):(t=d[n-1],this.shiftRow(t,i)):0===n?"up"==e?this.moveRowToBottom(i):(t=d[parseInt(n+1,10)],this.shiftRow(i,t)):"up"==e?(t=d[n-1],this.shiftRow(t,i)):(t=d[parseInt(n+1,10)],this.shiftRow(i,t)),this.$el.trigger("aftermoverow",[this.$el,i])}},shiftRow:function(e,t){a(t).insertBefore(e)},reindexRow:function(e,o){var t=this.el_body.dataset.name_prefix+".",i=this.el_body.dataset.id_prefix+"-",a=e.dataset.oldIndex||e.dataset.index;function d(e,t,i){var d=e.getAttribute(t);if(d){var n=new RegExp("^"+i+a);e.setAttribute(t,d.replace(n,i+o))}}delete e.dataset.oldIndex,e.dataset.index=o,e.querySelectorAll('[id^="formfield-'+i+'"]').forEach(function(e){d(e,"id","formfield-"+i)},this),e.querySelectorAll('[name^="'+t+'"]').forEach(function(e){d(e,"name",t)},this),e.querySelectorAll('[id^="'+i+'"]').forEach(function(e){d(e,"id",i)},this),e.querySelectorAll('[for^="'+i+'"]').forEach(function(e){d(e,"for",i)},this),e.querySelectorAll('[href*="#'+i+'"]').forEach(function(e){d(e,"href","#"+i)},this),e.querySelectorAll('[data-fieldname^="'+t+'"]').forEach(function(e){d(e,"data-fieldname",t)},this)},updateOrderIndex:function(){var i=0;this.getRows().forEach(function(e){var t=e.dataset.index;-1<["AA","TT"].indexOf(t)?this.reindexRow(e,t):(this.reindexRow(e,i),e.dataset.index=i,i++)},this);var e=this.el_body.dataset.name_prefix+".";this.el.querySelector('input[name="'+e+'count"]').value=this.countRows(),this.setUIState()},getParentRow:function(e){var t=e.closest(".datagridwidget-row");return t||null},ensureMinimumRows:function(){var e=this.getRows(),t=this.getVisibleRows();return!(!e.length||0!==t.length)&&(this.auto_append_row(),!0)}})}),require(["pat-registry","pat-datagridfield"],function(e){}),define("/home/_thet/data/dev/plone/buildout.coredev/src/collective.z3cform.datagridfield/src/collective/z3cform/datagridfield/static/datagridfield-bundle.js",function(){});
//# sourceMappingURL=datagridfield-bundle-compiled.js.map