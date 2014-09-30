var BudgetExpenditures = (function () {

    /**
     * Instance of BudgetExpenditures object
     * @type {Object}
     */
    var instance;


    /**
     * Contain data returned from server for budget expenditures table and related charts.
     *
     * @type {Array}
     * @private
     */

    function init() {
        // Private methods and variables
        function _init() {
            _renderBudgetExpendituresTable();
            _addListeners();
        };

        function _addListeners() {
            _listenAddNewRowButton();
            _listenViewButtons();
        };

        function _listenViewButtons() {
            $('#viewBtns').find('input').on('change', function() {
                if($(this).attr('view') == 'table') {
                    $('#budgetChartContainer').hide();
                    $('#budgetTableContainer').show();
                } else if($(this).attr('view') == 'chart'){
                    $('#budgetTableContainer').hide();
                    $('#budgetChartContainer').show();
                }
            });
        };

        function _listenAddNewRowButton() {
            //showing modal form
            $('.add-line').on('click', function() {
                $('.modal').modal('show')
            })
        };

        /**
         * Applying JQuery dataTables plugin for budget expenditures table.
         *
         * @private
         */
        function _renderBudgetExpendituresTable() {
            var budgetExpendituresTable = $('#budgetExpenditures').DataTable({
                'ajax': {
                    'url': 'data/budgetExpenditures.json',
                    "dataSrc": ""
                },
                "columns": [
                    {
                        "class": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<a href="#" class="row-details-switcher"> <span class="glyphicon glyphicon-plus-sign"></span></a>'
                    },
                    {
                        "width" : '5%',
                        "data": "fundCode"
                    },
                    {
                        "width" : '45%',
                        "data": "foundName"
                    },
                    {
                        "width" : '10%',
                        "data": "generalFund.total"
                    },
                    {
                        "width" : '10%',
                        "data": "specialFund.total"
                    },
                    {
                        "width" : '10%',
                        "data": "specialFund.consumption.total"
                    },
                    {
                        "width" : '10%',
                        "data": "specialFund.development.total"
                    },
                    {
                        "width" : '10%',
                        "data": "total"
                    }
                ],
                "order": [[1, 'asc']],
                'language': {
                    'url': 'js/plugins/jqueryDataTables/localization/ukrainian.txt'
                },
                'dom': '<"row"<"col-lg-6"l><"col-lg-6"f>r><"row"<"col-lg-12"t>><"row"<"col-lg-6"i><"col-lg-6"p>>',
                'drawCallback': function(settings) {
                    //Preventing default behaviour of switcher link to avoid jumping to top of the page
                    $('.row-details-switcher').on('click', function (event) {
                        event.preventDefault();
                    });

//                    _initializeEditableCells(budgetExpendituresTable);
                },
                'rowCallback': function (row, data) {
                    if (!data.hasOwnProperty('items') || data['items'].length === 0) {
                        $(row).find('td:first').empty();
                    };

                    var columns = $(row).find('td');
                    $(columns[3]).attr({
                        'title': 'З них:',
                        'data-container': 'body',
                        'data-toggle': 'popover',
                        'data-trigger': 'hover',
                        'data-html': 'true',
                        'data-placement': 'top',
                        'data-content': _generateTooltip(data['generalFund'])
                    });

                    $(columns[5]).attr({
                        'title': 'З них:',
                        'data-container': 'body',
                        'data-toggle': 'popover',
                        'data-trigger': 'hover',
                        'data-html': 'true',
                        'data-placement': 'top',
                        'data-content': _generateTooltip(data['specialFund']['consumption'])
                    });

                    $(columns[6]).attr({
                        'title': 'З них:',
                        'data-container': 'body',
                        'data-toggle': 'popover',
                        'data-trigger': 'hover',
                        'data-html': 'true',
                        'data-placement': 'top',
                        'data-content': _generateTooltip2(data['specialFund']['development'])
                    });

                    columns.popover();
                    console.log(data);
                }
            });
//            console.log(budgetExpendituresTable.tables());
            // Add event listener for opening and closing details
            _listenRowDetailsSwitcher(budgetExpendituresTable);
        };

        /**
         * Event listener for opening and closing table row details
         * @param dataTablesObject - instance of DataTables object
         * @private
         */
        function _listenRowDetailsSwitcher(dataTablesObject) {
            // Add event listener for opening and closing details
            $(dataTablesObject.context[0].nTable).find('tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = dataTablesObject.row( tr );

                if ( row.child.isShown() ) {
                    // This row is already open - close it
                    $(this).find('span').toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    $(this).find('span').toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
                    row.child( _formatRowDetails(row.data(), tr) ).show();
                    row.child().find('td:first').closest('td').css({
                        'paddingLeft': tr.find('td:first').outerWidth(),
                        'borderRight':'none',
                        'paddingRight': '0'
                    });
                    tr.addClass('shown');
                    row.child().find('td').popover();
                }
            });
        }

        /**
         * Formatting detail view with sub articles
         * @param rowData - the original data object for the row.
         * @param row - Jquery object of parent row
         * @returns {string}
         * @private
         */
        function _formatRowDetails(rowData, row) {
            var columns = row.find('td');
            var innerTable = '';
            if (rowData.hasOwnProperty('items') || rowData['items'].length >= 0) {
                innerTable += '<table class="table table-bordered table-hover table-condensed inner-table" style="width: ' + (row.outerWidth(true) - row.find('td:first').outerWidth(true)) + 'px;"><tbody>';
                $.each(rowData.items, function (index, element) {
                    innerTable += '<tr>' +
                        '<td style="width: ' + $(columns[1]).width() + 'px;">' + element['fundCode'] + '</td>' +
                        '<td style="width: ' + $(columns[2]).width() + 'px;">' + element['foundName'] + '</td>' +
                        '<td data-container="body" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="top" style="width: ' + $(columns[3]).width() + 'px;" title="З них:" data-content="' + _generateTooltip(element['generalFund']) + '">' + element['generalFund']['total'] + '</td>' +
                        '<td style="width: ' + $(columns[4]).width() + 'px;">' + element['specialFund']['total'] + '</td>' +
                        '<td data-container="body" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="top" style="width: ' + $(columns[5]).width() + 'px;" title="З них:" data-content="' + _generateTooltip(element['specialFund']['consumption']) + '">' + element['specialFund']['consumption']['total'] + '</td>' +
                        '<td data-container="body" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="top" style="width: ' + $(columns[6]).width() + 'px;"  title="З них:" data-content="' + _generateTooltip2(element['specialFund']['development']) + '">' + element['specialFund']['development']['total'] + '</td>' +
                        '<td style="width: ' + $(columns[7]).width() + 'px;">' + element['total'] + '</td>';
                });
                innerTable += '</tbody>';
            }
            return innerTable;
        }

        function _generateTooltip(data) {
            return '<p><strong>Оплата праці: </strong>' + data['wages'] + '</p><p><strong>Комунальні послуги та енергоносії: </strong>' + data['utilities'] + '</p>';
        }

        function _generateTooltip2(data) {
            return '<p><strong>Бюджет розвитку: </strong>' + data['developmentBudget'] + '</p><p><strong>Спеціального фонду: </strong>' + data['fromGeneralBudget'] + '</p>';
        }

        /**
         * Applying jEditable plugin on cells
         *
         * @param tableObject - JQuery dataTable object
         * @private
         */
        function _initializeEditableCells(tableObject) {
            tableObject.find('tbody td').editable( function(value, settings) {
                return(value)}, {
                "callback": function( sValue, y ) {
                    tableObject.fnDraw();
                },
                "height": "20px"
            } );
        };

        return {
            // Public methods and variables
            init: function() {
                _init();
            }
        };

    }

    return {

        /**
         * Return instance of BudgetExpenditures object
         *
         * @getInstance
         * @returns {Object} BudgetExpenditures object
         *
         * @public
         */
        getInstance: function () {

            if ( !instance ) {
                instance = init();
            }

            return instance;
        }

    };

})();

$(function(){
    var budgetExpenditures = BudgetExpenditures.getInstance();
    budgetExpenditures.init();
});