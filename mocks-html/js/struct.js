// parse table as json object
            
            var hardTree = [[0,'00000000',0],[1,10000000,0],[2,11000000,1],[3,11010000,2],[4,11010100,3],[5,11010200,3],[6,11010400,3],[7,11010500,3],[8,11020000,2],[9,11020200,8],[10,11023200,8],[11,12000000,1],[12,12030000,11],[13,12030100,12],[14,12030200,12],[15,13000000,1],[16,13010000,15],[17,13010200,16],[18,13030000,15],[19,13030200,18],[20,13050000,15],[21,13050100,20],[22,13050200,20],[23,13050500,20],[24,18000000,1],[25,18010000,24],[26,18010100,25],[27,18020000,24],[28,18020100,27],[29,18020200,27],[30,18030000,24],[31,18030100,30],[32,18030200,30],[33,18040000,24],[34,18040100,33],[35,18040200,33],[36,18040500,33],[37,18040600,33],[38,18040700,33],[39,18040800,33],[40,18040900,33],[41,18041300,33],[42,18041400,33],[43,18041500,33],[44,18041700,33],[45,18041800,33],[46,18050000,24],[47,18050300,46],[48,18050400,46],[49,19000000,1],[50,19010000,49],[51,19010100,50],[52,19010200,50],[53,19010300,50],[54,19010600,50],[55,20000000,0],[56,21000000,55],[57,21010000,56],[58,21010300,57],[59,21080000,56],[60,21080900,59],[61,22000000,55],[62,22080000,61],[63,22080400,62],[64,24000000,55],[65,24060000,64],[66,24060300,65],[67,24062100,65],[68,24110000,64],[69,24110900,68],[70,24170000,64],[71,25000000,55],[72,25010000,71],[73,25010100,72],[74,30000000,0],[75,31000000,74],[76,31010000,75],[77,31010200,76],[78,31030000,75],[79,33000000,74],[80,33010000,79],[81,33010100,80],[82,33010200,80],[83,33010400,80],[84,40000000,0],[85,41000000,84],[86,41020000,85],[87,41020100,86],[88,41030000,85],[89,41030600,88],[90,41030800,88],[91,41030900,88],[92,41031000,88],[93,41034400,88],[94,41035800,88],[95,50000000,0],[96,50100000,95],[97,50110000,96]]; 
            
            var table = $('#income');
            var dataObj = [];
            var tableRows = $('#income tr').length;
            console.log('table has '+tableRows+' rows');
            for (var i = 6; i < tableRows-1; i++) {
            	var tempObj = {};
            	tempObj.id = $('#income tr:nth-child('+i+') td:nth-child(1)').html();
            	tempObj.name = $('#income tr:nth-child('+i+') td:nth-child(2)').html();
            	tempObj.generalFund = $('#income tr:nth-child('+i+') td:nth-child(3)').html();
            	tempObj.specialFund = $('#income tr:nth-child('+i+') td:nth-child(4)').html();
            	tempObj.specialFundDevelopment = $('#income tr:nth-child('+i+') td:nth-child(5)').html();
            	tempObj.sum = $('#income tr:nth-child('+i+') td:nth-child(6)').html();
            	
            	dataObj.push(tempObj);
            } 
            
            var hieracy = {};
            
            hieracy.root = hardTree[0];
            hieracy.root.name = 'Доходи бюджету 2014';
            hieracy.root.children = [];
            
            var currentElement;
            
            for (i = 1; i < hardTree.length; i++) {
            	currentElement = hardTree[i];
            	if (currentElement[2] == 0) {
            		var temp = {};
            		temp.id = currentElement[0];
            		temp.value = currentElement[1];
            		
            		hieracy.root.children.push(temp);
        		}
            }
            for (i = 0; i < hieracy.root.children.length; i++) {
            	hieracy.root.children[i].children = [];
            	for (j = 1; j < hardTree.length; j++) {
            		if (hardTree[j][2] == hieracy.root.children[i].id) {
            			var temp = {};
            			temp.id = hardTree[j][0];
            			temp.value = hardTree[j][1];
            			
            			hieracy.root.children[i].children.push(temp);
        			}
            	}
            }
            for (i = 0; i < hieracy.root.children.length; i++) {
            	currentItem = hieracy.root.children[i];
        		for (k = 0; k < currentItem.children.length; k++) {
        			
        			//var subchildren = 0;
            		currentItem.children[k].children = [];
            		
        			for (j = 1; j < hardTree.length; j++) {
	            		if (hardTree[j][2] == currentItem.children[k].id) {
	            			
	            			var temp = {};
	            			temp.id = hardTree[j][0];
	            			temp.value = hardTree[j][1];
	            			
	            			currentItem.children[k].children.push(temp);
	        			}
            		}
        		}
            }
            
            for (i = 0; i < hieracy.root.children.length; i++) {
            	currentItem = hieracy.root.children[i];
        		for (k = 0; k < currentItem.children.length; k++) {
					currentItem2 = currentItem.children[k];
        			for (m = 0; m < currentItem2.children.length; m++) {
            			currentItem2.children[m].children = [];
            		
	        			for (j = 1; j < hardTree.length; j++) {
		            		if (hardTree[j][2] == currentItem2.children[m].id) {
		            			var temp = {};
		            			temp.id = hardTree[j][0];
		            			temp.value = hardTree[j][1];
		            			
		            			currentItem2.children[m].children.push(temp);
		        			}
	            		}
	            	}
        		}
            }
            console.log(hieracy);
            
            
            function attachProps(elem) {
            	// do smth
            }
            // applying data for no-children nodes
            function parseArray(someArray) {
            	for (var i=0; i < someArray.length; i++) {
            		var obj = someArray[i];
            		
            		if (obj.children.length > 0) {
            			for (var j=0; j < obj.children.length; j++) {
            				var obj2 = obj.children[j];
            				if (obj2.children.length > 0) {
            					for (var k=0; k < obj2.children.length; k++) {
            						var obj3 = obj2.children[k];
            						if (obj3.children.length > 0) {
            							for (var m=0; m < obj3.children.length; m++) {
            								var obj4 = obj2.children[m];
            								if (obj4.children.length > 0) {
            								} else {
            									
            								}
            							}
            						} else {
            							
            						}
            					}
            				} else {
            					
            				}
            			}
            		} else {
            			
            		}
            	}	
            } 
            
            parseArray(hieracy.root.children);
            
            //hieracy.root.children
            
            //console.log(dataObj);