/**
 *
 * Invoice Check
 *
 * @description
 *
 * @version 2018/08/05 初始版本。
 *
 * @author ace
 *
 * @see <a href="http://requirejs.org/">RequireJS</a>
 *
 * @see <a href="http://underscorejs.org/">Underscore.js</a>
 * @see <a href="https://github.com/jashkenas/underscore">jashkenas/underscore: JavaScript's utility _ belt</a>
 * @see <a href="http://backbonejs.org/">Backbone.js</a>
 * @see <a href="https://github.com/jashkenas/backbone">jashkenas/backbone: Give your JS App some Backbone with Models, Views, Collections, and Events</a>
 * @see <a href="https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites">Tutorials, blog posts and example sites · jashkenas/backbone Wiki</a>
 *
 * @see <a href="https://jquery.com/">jQuery</a>
 *
 * @see <a href="https://getbootstrap.com/">Bootstrap · The most popular HTML, CSS, and JS library in the world.</a>
 *
 * @see <a href="https://www.jasny.net/">Jasny · Web development</a>
 * @see <a href="https://www.jasny.net/bootstrap/">Jasny Bootstrap</a>
 * @see <a href="https://www.jasny.net/bootstrap/css/">CSS · Jasny Bootstrap</a>
 * @see <a href="https://www.jasny.net/bootstrap/javascript/">JavaScript · Jasny Bootstrap</a>
 *
 * @see <a href="http://plugins.krajee.com/file-input">Bootstrap File Input - © Kartik</a>
 * @see <a href="http://plugins.krajee.com/file-input/plugin-options">Bootstrap File Input Options - © Kartik</a>
 *
 * @comment
 *
 * @todo
 *
 */

Configurations.loadJS(Configurations.requirejsFile, function() {

	requirejs.config(tw.ace33022.RequireJSConfig);
	
	requirejs(["tw.ace33022.util.DateTimeUtils", "tw.ace33022.util.browser.FormUtils", "tw.ace33022.util.CommonUtils", "tw.ace33022.util.browser.ReUtils", "moment", "bootstrap-fileinput"], function(DateTimeUtils, FormUtils, CommonUtils, ReUtils, moment) {

		jQuery(document).ready(function() {
		
			window.addEventListener('beforeunload', function(event) {

				var confirmationMessage = '確定離開?';

				// event.returnValue = confirmationMessage;

				return confirmationMessage;
			});

			// 這個寫法只有在轉換瀏覽器的Tab時被觸發，轉換不同程式時則無用！？
			document.addEventListener('visibilitychange',

				function() {

					// if (!document.hidden) initInsertStatus(false);
					// console.log(document.visibilityState);
				},
				false
			);

			jQuery(window).on('focus', function(event) {});

			jQuery(window).on('blur', function(event) {});
			
			ReUtils.beforeInitEnv(function() {
			
				var localPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);
				
				var arrCodeDesc = new Array();
				var arrInvoicePrizeLogs = new Array();
				
				var arrInvoicePrizeLogsInitValue = new Array();
				
				var inpFileId = 'inpFile' + Math.random().toString(36).substr(2, 6);
				var selInYearMonthId = 'selInYearMonth' + Math.random().toString(36).substr(2, 6);
				var btnUpdateInvoiePrizeLogsId = 'btnUpdateInvoiePrizeLogs' + Math.random().toString(36).substr(2, 6);
				var btnExportId = 'inpExport' + Math.random().toString(36).substr(2, 6);
				var tabPrizeInvoiceId = 'tabPrizeInvoice' + Math.random().toString(36).substr(2, 6);
				var tabInvoiceId = 'tabInvoice' + Math.random().toString(36).substr(2, 6);
				
				var tag;
				
				function getPrizeItemDesc(code) { return CommonUtils.getCodeDesc(arrCodeDesc, '0004', code); };
				
				function checkPrize(callback) {
				
					var index;
					var invoiceTrs = jQuery('#' + tabInvoiceId + ' > tbody > tr');
					var prizeItem;
					var prizeCount = 0;
					
					var tr;
				
					jQuery('#' + btnExportId).attr('disabled', true);
					
					if ((invoiceTrs.length == 0) || (jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').length == 0)) {
					
						if (typeof callback === 'function') callback(prizeCount);
					}
					else {
					
						for (index = 0; index < invoiceTrs.length; index++) {

							tr = jQuery(invoiceTrs[index]);
						
							tr.css('background-color', '');
							tr.find('td').eq(1).text('');	// 清除td資料。
					
							prizeItem = CommonUtils.doGetInvoicePrizeItem(arrInvoicePrizeLogs, tr.find('td').eq(0).text());
							if (prizeItem != '') {
						
								tr.css('background-color', 'red');
								tr.find('td').eq(1).text(getPrizeItemDesc(prizeItem));
								
								jQuery(tr)[0].scrollIntoView(false);
							
								prizeCount++;
							}
						}
						
						if (prizeCount != 0) jQuery('#' + btnExportId).attr('disabled', false);
					
						if (typeof callback === 'function') callback(prizeCount);
					}
				};
				
				function getInvoicePrizeLogsFromGoogleDoc(callback) {

					// 連線到Google Doc取得發票獎項資料。
					FormUtils.showMarqueebar('更新發票獎項資料中，請稍候‧‧‧', 
					
						function(closeMarqueebar) {
					
							// ID of the Google Spreadsheet
							var spreadsheetID = '1TylSwUlq5j2dFlDWwmS5bO_X_QfxJ7U3Hmp3t11LQLU';

							// Make sure it is public or set to Anyone with link can view 
							var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/values?alt=json';

							jQuery.getJSON(url, function(data) {

								jQuery(data.feed.entry).each(function() {
							
									// console.log(this.gsx$inyearmonth.$t + ':' + this.gsx$invoiceno.$t + ':' + this.gsx$prizeitem.$t);
								
									arrInvoicePrizeLogsInitValue.push({"in_year_month": this.gsx$inyearmonth.$t, "invoice_no": this.gsx$invoiceno.$t, "prize_item": this.gsx$prizeitem.$t});
								});

								if (('localStorage' in window) && (window["localStorage"] != null)) localStorage[localPath + Configurations.webServiceVOPath + 'invoice_prize_logs'] = JSON.stringify(arrInvoicePrizeLogsInitValue);
							
								closeMarqueebar();
								
								if (typeof callback === 'function') callback();
							});
						}
					);
				};
				
				function initEnv() {
				
					FormUtils.showMarqueebar('資料處理中，請稍候‧‧‧', function(closeMarqueebar) {
							
						requirejs(["tw.ace33022.vo.CodeContrastDetail"], function(CodeContrastDetail) {
								
							var arrDescInitValue = new Array();
								
							var arrInYearMonth = new Array();
							
							// 應該要從網路下載這些說明文字。
							arrDescInitValue.push({"code_group": "0004", "code": "0000", "code_desc": "特獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0001", "code_desc": "頭獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0002", "code_desc": "二獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0003", "code_desc": "三獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0004", "code_desc": "四獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0005", "code_desc": "五獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0006", "code_desc": "六獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0100", "code_desc": "特別獎"});
							arrDescInitValue.push({"code_group": "0004", "code": "0101", "code_desc": "增開六獎"});
									
							arrDescInitValue.forEach(function(currentValue, index) {
									
								var vo = new CodeContrastDetail();
										
								vo.setCodeGroup(currentValue["code_group"]);
								vo.setCode(currentValue["code"]);
								vo.setCodeDesc(currentValue["code_desc"]);
								arrCodeDesc.push(vo);
							});
								
							arrInvoicePrizeLogsInitValue.forEach(function(currentValue, index) {
								
							  if (!_.find(arrInYearMonth, function(inYearMonth) { return inYearMonth == currentValue["in_year_month"]; })) arrInYearMonth.push(currentValue["in_year_month"]);
							});
							
							requirejs(["moment"], function(moment) {
													
								var index = arrInYearMonth.length - 1;
								var elmOption;
									
								var year;
								var month;
									
								for (index; index >= 0; index--) {

									year = arrInYearMonth[index].substr(0, 4);
									month = arrInYearMonth[index].substr(4, 2);
										
									elmOption = jQuery('<option />');
									elmOption.text(moment(new Date(year, month - 1)).format('YYYY/MM')).val(arrInYearMonth[index]);

									jQuery('#' + selInYearMonthId).append(elmOption);
										
									if (index == (arrInYearMonth.length - 1)) elmOption.attr('selected', 'selected');	// 預設選取當月月份
								}

								closeMarqueebar();
								
								jQuery('#' + selInYearMonthId).focus();

								jQuery('#' + selInYearMonthId).trigger('change');
							});	
						});
					});
				};
			
				tag = '<div class="container-fluid" style="padding-top: 5px;">'
						+	'	 <div class="row">'
						+	'		 <div class="col-md-offset-1 col-md-10">'
						+	'			 <form class="form-horizontal">'
						+	'				 <div class="form-group">'
						+	'					 <div class="col-sm-2">'
						+	'						 <label class="control-label" for="' + selInYearMonthId + '">發票年月：</label>'
						+	'					 </div>'
						+	'					 <div class="col-sm-5">'
						+	'						 <select class="form-control" id="' + selInYearMonthId + '" tabindex="0"></select>'
						+	'					 </div>'
						+	'					 <div class="col-sm-3">'
						+	'						 <input type="button" id="' + btnUpdateInvoiePrizeLogsId + '" class="btn btn-primary form-control" tabindex="0" value="更新發票獎項資料" />'
						+	'					 </div>'
						+	'				 </div>'
						+	'			 </form>'
						+	'		 </div>'
						+	'	 </div>'
						+	'	 <div class="row">'
						+	'		 <div class="col-md-offset-1 col-md-10">'
						+	'			 <table id="' + tabPrizeInvoiceId + '" class="table table-striped table-bordered table-responsive">'
						+	'				 <thead>'
						+	'					 <tr>'
						+	'					   <th style="text-align: center;">獎項</th>'
						+	'						 <th style="text-align: center;">中獎號碼</th>'
						+	'						 <th style="text-align: center;">說明</th>'
						+	'					 </tr>'
						+	'				 </thead>'
						+	'			   <tbody></tbody>'
						+	'		   </table>'
						+	'	   </div>'
						+	'	 </div>'
						+ '  <div class="row">'
						+ '    <div class="col-md-offset-1 col-md-10">'
						+	'			 <form class="form-horizontal">'
						+	'				 <div class="form-group">'
						+ '          <div class="col-md-9">'
						+	'			       <input type="file" id="' + inpFileId + '" tabindex="-1" data-show-preview="false" data-show-upload="false" data-show-remove="false" />'
						+ '          </div>'
						+ '          <div class="col-md-1">'
						+	'			       <input type="button" id="' + btnExportId + '" class="btn btn-primary" tabindex="0" value="中獎資料匯出" disabled>'
						+ '          </div>'
						+ '        </div>'
						+ '      </form>'
						+ '    </div>'
						+ '  </div>'
						+	'	 <div class="row">'
						+ '    <div class="col-md-offset-1 col-md-10">'
						+	'		   <table id="' + tabInvoiceId + '" class="table table-striped table-bordered table-responsive">'
						+	'			   <thead>'
						+	'				   <tr>'
						+	'					   <th style="text-align: center;">發票號碼</th>'
						+	'						 <th style="text-align: center;">中獎項目</th>'
						+	'					 </tr>'
						+	'				 </thead>'
						+	'				 <tbody></tbody>'
						+	'			 </table>'
						+	'		 </div>'
						+	'	 </div>'
						+	'</div>';
				jQuery('body').append(tag);
				
				jQuery('#' + inpFileId).fileinput();	// initialize
				
				jQuery('#' + selInYearMonthId).on('change', function(event) {
				
					FormUtils.showProgressbar('發票獎項資料處理中，請稍候‧‧‧', 
					
						function(closeProgressbar) {
							
							requirejs(["tw.ace33022.vo.InvoicePrizeLogs", "sprintfjs"], function(InvoicePrizeLogs) {
							
								if (jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').length != 0) jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').remove();
								
								arrInvoicePrizeLogs.length = 0;
								
								arrInvoicePrizeLogsInitValue.forEach(function(currentValue, index) {
									
									var vo;
										
									var tag;
									var prizeItem;
									var prizeDesc;
										
									if (currentValue["in_year_month"] == jQuery('#' + selInYearMonthId).val()) {
										
										vo = new InvoicePrizeLogs();
										vo.setValueFromJSONObject(currentValue);
											
										arrInvoicePrizeLogs.push(vo);
											
										if (vo.getPrizeItem() == '0001') {
										
											prizeItem = parseInt(vo.getPrizeItem());
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo() + '</td>'
													+ '  <td>' + '統一發票收執聯8位數號碼與中獎號碼相同者獎金20萬元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
											
											prizeItem++;
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo().substr(1) + '</td>'
													+ '  <td>' + '統一發票收執聯末7位數號碼與中獎號碼相同者各得獎金4萬元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
												
											prizeItem++;
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo().substr(2) + '</td>'
													+ '  <td>' + '統一發票收執聯末6位數號碼與中獎號碼相同者各得獎金1萬元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
												
											prizeItem++;
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo().substr(3) + '</td>'
													+ '  <td>' + '統一發票收執聯末5位數號碼與中獎號碼相同者各得獎金4千元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
												
											prizeItem++;
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo().substr(4) + '</td>'
													+ '  <td>' + '統一發票收執聯末4位數號碼與中獎號碼相同者各得獎金1千元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
												
											prizeItem++;
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(sprintf('%04d', prizeItem)) + '</td>'
													+ '  <td>' + vo.getInvoiceNo().substr(5) + '</td>'
													+ '  <td>' + '統一發票收執聯末3位數號碼與中獎號碼相同者各得獎金2百元' + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
										}
										else {
										
											prizeDesc = '';
												
											if (vo.getPrizeItem() == '0000') {
												
												prizeDesc = '統一發票收執聯8位數號碼與中獎號碼相同者獎金200萬元';
											}
											else if (vo.getPrizeItem() == '0100') {
												
												prizeDesc = '統一發票收執聯8位數號碼與中獎號碼相同者獎金1,000萬元';
											}
											else {
												
												prizeDesc = '統一發票收執聯末3位數號碼與中獎號碼相同者各得獎金2百元';
											}
												
											tag = '<tr>'
													+ '  <td style="text-align: center;">' + getPrizeItemDesc(vo.getPrizeItem()) + '</td>'
													+ '  <td>' + vo.getInvoiceNo() + '</td>'
													+ '  <td>' + prizeDesc + '</td>'
													+ '</tr>';
											jQuery('#' + tabPrizeInvoiceId + ' > tbody').append(tag);
										}
									}
								});
								
								checkPrize(function(prizeCount) {

									closeProgressbar();

									if (prizeCount == 0) {
									
										if ((jQuery('#' + tabInvoiceId + ' > tbody > tr').length != 0) && (jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').length != 0)) FormUtils.showMessage('可惜，沒有中獎記錄！');
									}
									else {
									
										FormUtils.showMessage('恭喜，有' + prizeCount + '筆發票中獎！');
									}
								});
							});
						}
					);
				});
				
				jQuery('#' + inpFileId).on('change', function(event) {
				
					if (jQuery('#' + tabInvoiceId + ' > tbody > tr').length != 0) jQuery('#' + tabInvoiceId + ' > tbody > tr').remove();
					
					FormUtils.showProgressbar(

						'資料載入中',
						function(closeProgressbar) {
							
							requirejs(["papaparse"], function(PapaParse) {

								// PapaParse.SCRIPT_PATH = tw.ace33022.RequireJSConfig.baseUrl + tw.ace33022.RequireJSConfig.paths["papaparse"] + '.js';
								PapaParse.SCRIPT_PATH = tw.ace33022.RequireJSConfig.paths["papaparse"] + '.js';
								
								PapaParse.parse(jQuery('#' + inpFileId).get(0).files[0], {

									header: false,
									dynamicTyping: true,
									worker: false,
									step: function(results, parser) {
									
										// console.log("Row data:", results);
										
										var rowData = results.data[0];
										var tag = '<tr>'
														+ '  <td>' + rowData[0] + '</td>'
														+ '  <td style="text-align: center;">' + '' + '</td>'
														+ '</tr>';
													
										jQuery('#' + tabInvoiceId + ' > tbody').append(tag);
									},
									complete: function() {
									
										checkPrize(function(prizeCount) {
									
											closeProgressbar();
											
											if (prizeCount == 0) {
								
												if ((jQuery('#' + tabInvoiceId + ' > tbody > tr').length != 0) && (jQuery('#' + tabPrizeInvoice + ' > tbody > tr').length != 0)) FormUtils.showMessage('可惜，沒有中獎記錄！');
											}
											else {
									
												FormUtils.showMessage('恭喜，有' + prizeCount + '筆發票中獎！');
											}
										});
									}
								});
							});
						}
					);
				});
				
				jQuery('#' + btnUpdateInvoiePrizeLogsId).on('click', function(event) {
				
					FormUtils.showConfirmMessage('確定連線更新發票獎項資料？', function() {
					
						if (jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').length != 0) jQuery('#' + tabPrizeInvoiceId + ' > tbody > tr').remove();
						
						jQuery('#' + selInYearMonthId + ' option').remove();
						
						arrInvoicePrizeLogsInitValue.length = 0;
						
						getInvoicePrizeLogsFromGoogleDoc(initEnv);
					});
				});
					
				jQuery('#' + btnExportId).on('click', function(event) {

					requirejs(["bootbox"], function(bootbox) {
						
						var exportFile = function(filename) {
						
							FormUtils.showProgressbar('中獎發票資料匯出中，請稍候‧‧‧', function(closeProgressbar) {
							
								requirejs(["filesaver"], function() {
								
									var index;
									var tr;
									
									var data = new Array();
									var result = new Array();
									var csvString;
									
									var file;
									
									try {
									
										var invoiceTrs = jQuery('#' + tabInvoiceId + ' > tbody > tr');
								
										for (index = 0; index < invoiceTrs.length; index++) {

											tr = jQuery(invoiceTrs[index]);
											if (tr.find('td').eq(1).text() != '') {
											
												data.push([tr.find('td').eq(0).text(), tr.find('td').eq(1).text()]);
											}
										}
										
										for (index = 0; index < data.length; index++) {
										
											csvString = data[index][0] + ',' + data[index][1];
											
											if (index != (data.length - 1)) csvString += '\n';
											
											result.push(csvString);
										}
										
										file = new File(result, filename, {type: "text/csv"});
									
										saveAs(file);
									}
									catch(error) {
						
										FormUtils.showMessage('存檔過程有誤！訊息：' + error.message);
									}
									finally {
									
										closeProgressbar();
									}
								});
							});
						};
						
						FormUtils.showInputModal({
						
							"title": "檔案名稱", 
							"defaultInputVaule": "PrizedInvoice.csv",
							"callback": function(filename) {
							
								if (filename != null) {

									if (filename == '') {
								
										FormUtils.showMessage('檔案名稱不可空白！');
									}
									else {
									
										FormUtils.showProgressbar('中獎發票資料匯出中，請稍候‧‧‧', 
										
											function(closeProgressbar) {
										
												requirejs(["filesaver"], function() {
												
													var index;
													var tr;
													
													var data = new Array();
													var result = new Array();
													var csvString;
													
													var file;
													
													try {
													
														var invoiceTrs = jQuery('#' + tabInvoiceId + ' > tbody > tr');
												
														for (index = 0; index < invoiceTrs.length; index++) {

															tr = jQuery(invoiceTrs[index]);
															if (tr.find('td').eq(1).text() != '') {
															
																data.push([tr.find('td').eq(0).text(), tr.find('td').eq(1).text()]);
															}
														}
														
														for (index = 0; index < data.length; index++) {
														
															csvString = data[index][0] + ',' + data[index][1];
															
															if (index != (data.length - 1)) csvString += '\n';
															
															result.push(csvString);
														}
														
														file = new File(result, filename, {type: "text/csv"});
													
														saveAs(file);
													}
													catch(error) {
										
														FormUtils.showMessage('存檔過程有誤！訊息：' + error.message);
													}
													finally {
													
														closeProgressbar();
													}
												});
											}
										);
									}
								}
							}
						});
					});
				});

				if (('localStorage' in window) && (window["localStorage"] != null)) {
				
					if (localStorage.getItem(localPath + Configurations.webServiceVOPath + 'invoice_prize_logs')) {
					
						arrInvoicePrizeLogsInitValue = JSON.parse(localStorage.getItem(localPath + Configurations.webServiceVOPath + 'invoice_prize_logs'));
						
						initEnv();
					}
					else {
					
						FormUtils.showConfirmMessage('尚未建立發票獎項資料，是否連線更新？', 
						
							function() {
						
								getInvoicePrizeLogsFromGoogleDoc(initEnv);
							}
						);
					}
				}
				else {
						
					// 不支援localStorage的狀況直接取得Google Doc的發票獎項資料。
					getInvoicePrizeLogsFromGoogleDoc(initEnv);
				}
			});
		});	// document ready
	});	
});