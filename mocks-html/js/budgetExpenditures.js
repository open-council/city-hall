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
    var _budgetExpendituresData = [];

    /**
     * Contain list of funds with name and it's code
     *
     * @type {Array}
     * @private
     */
    var _fundsList = [];

    function init() {
        // Private methods and variables
        function _init() {
            _getFundsList();
            _getBudgetExpendituresData();
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

        function _getFundsList() {
            $.ajax({
                url: 'data/funds.json',
                type: 'get',
                dataType: 'json',
                error: function(data){
                },
                success: function(data){
                    _fundsList = data;
                    console.log(data);
                }
            });

        }

        function _getBudgetExpendituresData() {
            $.ajax({
                url: 'data/budgetExpenditures.json',
                type: 'get',
                dataType: 'json',
                error: function(data){
                },
                success: function(data){
                    _budgetExpendituresData = data;
                    _renderBudgetExpendituresTable();
                    _renderBudgetExpendituresChart();
                }
            });
        };

        /**
         * Applying JQuery dataTables plugin for budget expenditures table.
         *
         * @private
         */
        function _renderBudgetExpendituresTable() {
            var table = $('#budgetExpenditures');
            table.find('tbody').html(_generateBudgetExpendituresTable());
            var budgetExpendituresTable = table.dataTable({
                "oLanguage": {
                    "sUrl": "js/plugins/jqueryDataTables/localization/ukrainian.txt"
                },
                "sDom": "<'row'<'col-lg-6'l><'col-lg-6'f>r>t<'row'<'col-lg-6'i><'col-lg-6'p>>",
                'fnDrawCallback': function() {
                    $('.dataTables_filter').find('input').addClass('form-control input-sm search-input');
                    $('.dataTables_length').find('select').addClass('form-control input-sm');
                    $('.dataTables_paginate').find('ul').css('margin-right', '8px');
                    _initializeEditableCells(budgetExpendituresTable);
                }
            });
        };

        /**
         * Drawing budget expenditures chart
         *
         * @private
         */
        function _renderBudgetExpendituresChart() {
            google.load('visualization', '1', {'callback': drawChart, 'packages':['corechart']});
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Фонд', 'Сумма'],
                    ['Державне управління',     23070500],
                    ['Фонд 1',      23078970],
                    ['Фонд 2',  25870500],
                    ['Фонд 3', 15070500],
                    ['Фонд 4',    3070500]
                ]);

                var options = {
                    title: 'Видатки міського бюджету'
                };

                var chart = new google.visualization.PieChart($('#budgetExpendituresChart')[0]);

                //For correct render of chart container need to be visible
                var chartContainer = $('#budgetChartContainer');
                if(chartContainer.is(':visible')){
                    chart.draw(data, options);
                } else {
                    chartContainer.show();
                    chart.draw(data, options);
                    chartContainer.hide();
                }

                google.visualization.events.addListener(chart, 'select', function() {
                    var selected = chart.getSelection();
                    $('#budgetExpendituresSubChart').empty();
                    _renderBudgetExpendituresSubChart();
                });
            }

        };

        function _renderBudgetExpendituresSubChart() {
            google.load('visualization', '1', {'callback': drawNewChart, 'packages': ['corechart']});
            function drawNewChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Суб Фонд', 'Сумма'],
                    ['Суб Фонд 1', 3070500],
                    ['Суб Фонд 2', 3078970],
                    ['Суб Фонд 3', 5870500],
                    ['Суб Фонд 4', 5070500],
                    ['Суб Фонд 5', 070500]
                ]);

                var options = {
                    title: 'Видатки міського бюджету -> Суб фонди'
                };

                var chart = new google.visualization.PieChart($('#budgetExpendituresSubChart')[0]);

                //For correct rendering of chart container need to be visible.
                var chartContainer = $('#budgetChartContainer');
                if(chartContainer.is(':visible')){
                    chart.draw(data, options);
                } else {
                    chartContainer.show();
                    chart.draw(data, options);
                    chartContainer.hide();
                }
            };
        };

        function _generateBudgetExpendituresTable() {
            var tableBodyHTML = '';
            $.each(_budgetExpendituresData, function(index, element) {
                tableBodyHTML += '<tr>' +
                    '<td>' + element["fundCode"] + '</td>' +
                    '<td>' + element["foundName"] + '</td>' +
                    '<td>' + element["generalFund"]["total"] + '</td>' +
                    '<td>' + element["generalFund"]["wages"] + '</td>' +
                    '<td>' + element["generalFund"]["utilities"] + '</td>' +
                    '<td>' + element["specialFund"]["total"] + '</td>' +
                    '<td>' + element["specialFund"]["consumption"]["total"] + '</td>' +
                    '<td>' + element["specialFund"]["consumption"]["wages"] + '</td>' +
                    '<td>' + element["specialFund"]["consumption"]["utilities"] + '</td>' +
                    '<td>' + element["specialFund"]["development"]["total"] + '</td>' +
                    '<td>' + element["specialFund"]["development"]["developmentBudget"] + '</td>' +
                    '<td>' + element["specialFund"]["development"]["fromGeneralBudget"] + '</td>' +
                    '<td>' + element["total"] + '</td>' +
                '</tr>'
            });
            return tableBodyHTML;
        }

        /**
         * Applying jEditable plugin on cells
         *
         * @param tableObject - JQuery dataTable object
         * @private
         */
        function _initializeEditableCells(tableObject) {
            tableObject.find('tbody td').editable( function(value, settings) {
                console.log(this);
                console.log(value);
                console.log(settings);
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