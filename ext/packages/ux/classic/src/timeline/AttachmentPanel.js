/**
 * Deprecated: 02/03/2016 by HMORJAN
 * Note: This functionality can be done on Ext.ux.timeline.Panel
 * only need to instance the class with the property timelineType:"attachment"
 */

Ext.define('Ext.ux.timeline.AttachmentPanel', {
    /*
        extend: "Ext.panel.Panel",
        xtype: "attachmentTimeLinePanel",
        requires:[
            "Ext.ux.timeline.DetailPropertyGrid"
        ],
        cls: "metro v3",
        width: 400,
        height: 400,
        layout: "border",
        thumbnailField: "thumbnail",
        nameField: "name",
        userNameField:"userName",
        descriptionField: "description",
        dateField: "date",
        //dateField:"startDate",
        timeField:"startTime",
        hourField: "hour",
        typeField:"fileType",
        userThumbnailField:"userThumbnail",
        stateField:"status",
        fileTypeField:"fileType",
        data: [],
        displayMode: "w",
        tileTpl: function () {
            var me = this;
            return new Ext.XTemplate(
                "<tpl for=\".\">" +
                    "{%" +
                    "var stateColor=\"jumsuccess\";" +
                    "console.log(values);" +
                    "%}"+
                        '<div class="list {%out.push(stateColor)%}" style ="margin: 0;width:200px;height: 60px;" title="User:{'+me.userNameField+'}\nFile: {'+me.descriptionField+'}">' +
                            "<div style=\"" +
                            "margin: 0px;" +
                            "width: 48px;" +
                            "height: 60px;" +
                            "top:0px;" +
                            "text-align: center;" +
                            "background-position: center;" +
                            "background-repeat: no-repeat;" +
                            "background-size: cover;" +
                            "background-image: url({" + me.userThumbnailField + "})" +
                            "\" class=\"list-icon\">" +
                                "<div class=\"fileType-badge\">" +
                                    "<span  class=\""+Ext.manifest.globals.fontBasePrefix+'{'+me.typeField+'}"></span>'+
                                "</div>" +
                            "</div>"+
                            '<div class="list-content" style ="padding: 0;text-align: left; position:absolute;top:0px;">' +
                                '<div>{' + me.dateField + '}</div>' +
                                "<div class=\"list-title text-ellipsis\" style=\"text-align: left;\"><span style=\"font-style: italic;font-size: 12px;\" title=\"File description\">{" + me.descriptionField + "}</span></div>" +
                                "<div class=\"text-ellipsis\" style=\"text-align: left; font-style: italic;font-size: 12px;\">{" + me.userNameField + "}</div>" +
                                '<div class="fileType-badge {' + me.fileTypeField + ':this.getFileType()}"></div>' +
                            "</div>" +

                    "</div>" +
                "</tpl>",
                {
                    getFileType: function (uuid) {
                        var record=me.attachmentTypeStore.findRecord("uuid",uuid);
                        //console.log(Ext.manifest.globals.fontBasePrefix+Ext.getFileType(record.get("name"))+Ext.manifest.globals.fontBasePostfix);
                        return Ext.manifest.globals.fontBasePrefix+Ext.getFileType(record.get("name"))+Ext.manifest.globals.fontBasePostfix;
                    }
                }
            );
            /!*"<tpl for=\".\">" +
             //'<div class="list jumalert-flat" style ="margin: 0px;">' +
             "{%" +
             "var stateColor=\"jumsuccess\";" +
             //"var state=values."+me.stateField+";" +
             //'switch(state){' +
             //'case 0:' +
             //    'stateColor="yellow";' +
             //    'break;' +
             //'case 1:' +
             //    'stateColor="blue";' +
             //    'break;' +
             //'case 2:' +
             //    'stateColor="green";' +
             //    'break;' +
             //'case 3:' +
             //    'stateColor="red";' +
             //    'break;' +
             //'default:' +
             //    'stateColor="dark";' +
             //    'break;' +
             //'}' +
             //'console.log(stateColor);' +
             "%}"+
             //'<div class="list {%out.push(stateColor)%}-flat" style ="margin: 0;width:200px;height: 60px;" title="User:{'+me.userNameField+'}\nFile: {'+me.descriptionField+'}">' +
             '<div class="list {%out.push(stateColor)%}" style ="margin: 0;width:200px;height: 60px;" title="User:{'+me.userNameField+'}\nFile: {'+me.descriptionField+'}">' +
             //"<img src=\"{" + me.thumbnailField + "}\" class=\"list-icon\">" +
             "<div style=\"" +
             "margin: 0px;" +
             "width: 48px;" +
             "height: 60px;" +
             //"{% if (values." + me.thumbnailField + '==="") { %}' +
             //    "top:7px" +
             //"{% } %}"+
             "top:7px" +
             "font-size: 32px;" +
             "text-align: center;" +
             "background-position: center;" +
             "background-repeat: no-repeat;" +
             "background-size: cover;" +
             "background-image: url({" + me.userThumbnailField + "})" +
             "\" class=\"list-icon\">" +
             //"<div><span class=\"version-badge bg-green\">1.0</span></div>" +
             //"{% if (values." + me.thumbnailField + '!=="") { %}' +
             //    "<div>" +
             //        '<img style=\"border-radius: 50%/10%\" src="{' + me.thumbnailField + '}">' +
             //    "</div>" +
             //'{% }else{ %}' +
             "<div class=\"fileType-badge\">" +
             "<span  class=\""+Ext.manifest.globals.fontBasePrefix+'{'+me.typeField+'}"></span>'+
             "</div>" +
             //"{% } %}"+
             //"<div style=\"font-size:13px; \" class=\"list-remark\">{" + me.timeField + "}</div>" +
             //"<div style=\"font-size:11px; \" class=\"list-remark\">{" + me.dateField + "}</div>" +
             "</div>"+
             '<div class="list-content" style ="padding: 0;text-align: left;">' +
             "<div class=\"list-title text-ellipsis\" style=\"text-align: left;\"><span style=\"font-style: italic;font-size: 12px;\" title=\"File description\">{" + me.descriptionField + "}</span></div>" +
             "<div title:\"File Name:\"class=\"list-title text-ellipsis\" style=\"text-align: left;\"><span style=\"font-style: italic;font-size: 12px;\" title=\"File description\">{" + me.nameField + "}</span></div>" +
             "<div><span>{" + me.dateField + "}</span></div>" +
             //"<div class=\"text-ellipsis\"><span style=\"font-size: 14px;font-weight: bold;\">{" + me.userNameField + "}</span></div>" +
             //"<div class=\"triangle-bottomright\">1.0</div>" +
             "</div>" +

             "</div>" +
             "</tpl>");*!/

            //"<tpl for=\".\">" +
            //    //'<div class="list jumalert-flat" style ="margin: 0px;">' +
            //"{%" +
            //"var stateColor=\"blue\";" +
            //    //"var state=values."+me.stateField+";" +
            //    //'switch(state){' +
            //    //'case 0:' +
            //    //    'stateColor="yellow";' +
            //    //    'break;' +
            //    //'case 1:' +
            //    //    'stateColor="blue";' +
            //    //    'break;' +
            //    //'case 2:' +
            //    //    'stateColor="green";' +
            //    //    'break;' +
            //    //'case 3:' +
            //    //    'stateColor="red";' +
            //    //    'break;' +
            //    //'default:' +
            //    //    'stateColor="dark";' +
            //    //    'break;' +
            //    //'}' +
            //    //'console.log(stateColor);' +
            //"%}"+
            //'<div class="list {%out.push(stateColor)%}-flat" style ="margin: 0;width:200px;height: 60px;" title="File: {'+me.nameField+'}">' +
            //    //"<img src=\"{" + me.thumbnailField + "}\" class=\"list-icon\">" +
            //"<div style=\"" +
            //"margin: 0px;" +
            //"width: 40px;" +
            //"height: 40px;" +
            //"{% if (values." + me.thumbnailField + '==="") { %}' +
            //"top:7px" +
            //"{% } %}"+
            //    //"top:7px" +
            //    //"font-size: 32px;" +
            //    //"text-align: center;" +
            //    //"background-position: center;" +
            //    //"background-repeat: no-repeat;" +
            //    //"background-size: cover;" +
            //    //"background-image: url(data:image/jpeg;base64,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)" +
            //    //"background-image: url({" + me.thumbnailField + "})" +
            //"\" class=\"list-icon\">" +
            //    //"<div><span class=\"version-badge bg-green\">1.0</span></div>" +
            //"{% if (values." + me.thumbnailField + '!=="") { %}' +
            //"<div>" +
            //'<img style=\"border-radius: 50%/10%\" src="{' + me.thumbnailField + '}">' +
            //"</div>" +
            //'{% }else{ %}' +
            //"<div>" +
            //"<span  class=\""+Ext.manifest.globals.fontBasePrefix+'{'+me.typeField+'}"></span>'+
            //"</div>" +
            //"{% } %}"+
            //    //"<div style=\"font-size:13px; \" class=\"list-remark\">{" + me.timeField + "}</div>" +
            //    //"<div style=\"font-size:11px; \" class=\"list-remark\">{" + me.dateField + "}</div>" +
            //"<div class=\"list-title text-ellipsis\" style=\"width:199px;text-align: left;\"><span style=\"font-style: italic;font-size: 12px;\">{" + me.descriptionField + "}</span></div>" +
            //"</div>"+
            //'<div class="list-content" style ="padding: 0;text-align: left;">' +
            //"<div><span>{" + me.dateField + "}</span></div>" +
            //"<div class=\"text-ellipsis\"><span style=\"font-size: 14px;font-weight: bold;\">{" + me.userNameField + "}</span></div>" +
            //    //"<div class=\"triangle-bottomright\">1.0</div>" +
            //"</div>" +
            //
            //"</div>" +
            //"</tpl>");
        },
        initComponent: function () {
            var me = this,
                Ex = Ext,
                ExLocale = Ex.localization;
            var timeLineId = "timeline-" + Ext.guid();
            var scaleId = "scale-" + Ext.guid();
            var tpl = me.tileTpl();
            var scale;
            var timeLine;
            var data = me.data;
            var customTime;
            var currentTime;
            var timelineStore=me.timelineStore;
            var changeCustomTime = function (customDate) {
                var range;
                timeLine.setCustomTime(customDate);
                scale.setCustomTime(customDate);
                switch (me.displayMode) {
                    case "d":
                        range = me.getDayRange(customDate);
                        break;
                    case "w":
                        range = me.getWeekRange(customDate);
                        break;
                    case "m":
                        range = me.getMonthRange(customDate);
                        break;
                }
                timeLine.setVisibleChartRange(range[0], range[1]);
                scale.setVisibleChartRange(range[0], range[1]);
            };
            var datePicker = Ext.widget("datepicker", {
                width:280,
                //minDate: new Date(),
                handler: function (picker, date) {
                    customTime = date;
                    changeCustomTime(date);
                }
            });
            var detailPropertyGrid=Ext.widget("detailPropertyGrid", {//Ext.create('Ext.ux.grid.property.Grid', {//Ext.widget("propertygrid",{
                region: "south"//,
               /!* autoScroll:true,
                hideHeaders:true,
                layout:"fit",
                groupingConfig: {
                    groupHeaderTpl: 'File detail',
                    disabled: false,
                    startCollapsed: false
                },*!/
                /!*listeners: {
                    afterrender: function () {
                        var columns = this.columns;
                        columns[0].setWidth(100);
                    }
                }*!/
            });
            var titleText=Ext.widget("text",{
                text:"Detail for",
                degrees:270
            });
            var dockedPanel=Ext.widget("panel",{
                dock: "right",
                width: 300,
                layout: "border",
                items: [
                    {
                        xtype: "panel",
                        bodyPadding: 10,
                        region: "center",
                        height: 300,
                        items: [datePicker],
                        tbar: [
                            {
                                text: ExLocale.timeLine.button.dayMode,
                                flex: 1,
                                handler: function () {
                                    me.displayMode = "d";
                                    changeCustomTime(customTime);
                                }
                            },
                            {
                                text: ExLocale.timeLine.button.weekMode,
                                flex: 1,
                                handler: function () {
                                    me.displayMode = "w";
                                    changeCustomTime(customTime);
                                }

                            },
                            {
                                text: ExLocale.timeLine.button.monthMode,
                                flex: 1,
                                handler: function(){
                                    me.displayMode = "m";
                                    changeCustomTime(customTime);
                                }

                            }
                        ]
                    }, detailPropertyGrid
                ]
            });
            Ext.apply(me, {
                titleText:titleText,
                dockedItems: [
                    dockedPanel
                ],
                items: [
                    {
                        region: "north",
                        bodyStyle: "padding-right: 17px;",
                        width: 400,
                        height: 46,
                        html: '<div class ="listview" id="' + scaleId + '" style="width: 100%; height: 100%;">IT WORKS!!!!!</div>'
                    }, {
                        region: "center",
                        width: 400,
                        autoScroll: true,
                        overflowY: "scroll",
                        height: 400,
                        html: '<div class ="listview" id="' + timeLineId + '" style="width: 100%; height: 100%;">IT WORKS!!!!!</div>'
                    }

                ],
                lbar: {
                    style: 'background-color: transparent;',
                    items: [
                        {
                            iconCls: Ext.manifest.globals.fontBasePrefix + 'close' + Ext.manifest.globals.fontBasePostfix,
                            style: 'font-size: 17px;',
                            cls: 'jumblack-flat',
                            handler: function () {
                                me.fireEvent("closeAttachmentHistorical");
                            }
                        },
                        "->",
                        titleText
                    ]
                }
            });
            me.on("afterrender", function () {

                // an item every month
                var i, iMax = 1000;
                var num = 0;
                var date = new Date(2012, 0, 1);
                var userConfig = [
                    {
                        "thumbnail": "data:image/jpeg;base64,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",
                        "userName": "MYAX",
                        "description": "description"
                    },
                    {
                        "thumbnail": "data:image/jpeg;base64,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",
                        "userName": "WARROYO",
                        "description": "description"
                    },
                    {
                        "thumbnail": "data:image/jpg;base64,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",
                        "userName": "HMORJAN",
                        "description": "description"
                    }
                ];
                if (!me.data.length){
                    for (i = 0; i < iMax; i++) {
                        date.setMonth(date.getMonth() + 1);
                        var x = Math.floor((Math.random() * 3));
                        var currentDate = new Date(date);
                        var tplData = userConfig[x];
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+minutes.toString();
                        data.push({
                            "start": currentDate,
                            //"content": "item " + num,
                            "content": tpl.apply(tplData),
                            "group": "Remove Record"
                        });
                    }

                    // an item every day
                    date = new Date(2012, 3, 1);
                    for (i = 0; i < iMax; i++) {
                        date.setDate(date.getDate() + 1);
                        var x = Math.floor((Math.random() * 3));
                        var currentDate = new Date(date);
                        var tplData = userConfig[x];
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+minutes.toString();
                        data.push({
                            "start": currentDate,
                            //"content": "item " + num,
                            "content": tpl.apply(tplData),
                            "group": "Add Record"
                        });
                    }

                    // an item every hour
                    date = new Date(2015, 9, 1);
                    for (i = 0; i < iMax; i++) {
                        date.setHours(date.getHours() + 1);
                        var x = Math.floor((Math.random() * 3));
                        var currentDate = new Date(date);
                        var tplData = userConfig[x];
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+minutes.toString();
                        data.push({
                            "start": currentDate,
                            //"content": "item " + num,
                            "content": tpl.apply(tplData),
                            "group": "Edit Record"
                        });
                    }

                    // items on the same spot
                    date = new Date(2012, 9, 1);
                    for (i = 0; i < iMax; i += 2) {
                        date.setHours(date.getHours() + 1);
                        var x = Math.floor((Math.random() * 3));
                        var currentDate = new Date(date);
                        var tplData = userConfig[x];
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+ minutes.toString();
                        data.push({
                            "start": currentDate,
                            //"content": "item " + num,
                            "content": tpl.apply(tplData),
                            "group": "View Record"
                        });
                    }
                }else{
                    Ext.Array.each(me.data, function(dataItem){
                        var tplData = dataItem.content;
                        //var convertedDate=Ext.getFullFormatDate(dataItem.start);
                        var currentDate = new Date (dataItem.start);
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        var startDate=currentDate.getDate().toString()+"/"+(currentDate.getMonth()+1).toString()+"/"+currentDate.getFullYear().toString();
                        var startTime=(hours<10? "0":"")+ hours.toString()+":"+(minutes<10? "0":"")+ minutes.toString();
                        tplData.startDate=startDate;
                        tplData.startTime=startTime;
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+ minutes.toString();

                        Ext.apply(dataItem,{
                            start: currentDate,
                            startDate:startDate,
                            startTime:startTime,
                            content: tpl.apply(tplData)
                        });
                    });
                    /!*Ext.Array.each(me.data, function(dataItem){
                        var tplData = dataItem.content;
                        console.log(dataItem.start);
                        var currentDate = typeof dataItem.start ==="string"? new Date (dataItem.start): dataItem.start;
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        var startDate=currentDate.getDate().toString()+"/"+(currentDate.getMonth()+1).toString()+"/"+currentDate.getFullYear().toString();
                        var startTime=(hours<10? "0":"")+ hours.toString()+":"+(minutes<10? "0":"")+ minutes.toString();
                        tplData.startDate=startDate;
                        tplData.startTime=startTime;
                        tplData.date= currentDate.getDate().toString()+
                            "/"+(currentDate.getMonth()+1).toString()+"/"+
                            currentDate.getFullYear().toString()+
                            " - "+(hours<10? "0":"")+ hours.toString()+
                            ":"+(minutes<10? "0":"")+ minutes.toString();

                        Ext.apply(dataItem,{
                            start: currentDate,
                            startDate:startDate,
                            startTime:startTime,
                            content: tpl.apply(tplData)
                        });
                    });*!/
                }

                // specify options
                var options = {
                    "width": "100%",
                    //"height": "auto",
                    "height": "200%",
                    "style": "box", // optional
                    "box.align": "left",
                    "start": new Date(2012, 0, 1),
                    "end": new Date(2012, 11, 31),
                    "cluster": true,
                    "axisOnTop": true,
                    "groupsChangeable": false,
                    "groupsOnRight": false,
                    "groupMinHeight": 100,
                    groupsWidth: "100px",
                    timeChangeable: false,
                    showCustomTime: true,
                    showMajorLabels: false,
                    showMinorLabels: false
                };
                var options2 = {
                    "width": "100%",
                    "height": "auto",
                    "style": "dot", // optional
                    //layout: "box",
                    "start": new Date(2012, 0, 1),
                    "end": new Date(2012, 11, 31),
                    "cluster": true,
                    "axisOnTop": true,
                    "groupsChangeable": false,
                    groupsWidth: "100px",
                    align: "left",
                    timeChangeable: false,
                    showCustomTime: true,
                    "groupsOnRight": false,
                    "groupMinHeight": 100
                };

                var onTimeLineRangeChange = function () {
                    var range = timeLine.getVisibleChartRange();
                    scale.setVisibleChartRange(range.start, range.end);
                };

                var onScaleRangeChange = function () {
                    var range = scale.getVisibleChartRange();
                    timeLine.setVisibleChartRange(range.start, range.end);
                };
                //var onSelect= function () {
                //    var sel = timeLine.getSelection();
                //    if (sel.length) {
                //        if (sel[0].row != undefined) {
                //            var row = sel[0].row;
                //            var record=timeLine.getData(row);
                //            //document.title = "event " + row + " selected";
                //            me.fireEvent("timelineSelection",record[0]);
                //        }
                //    }
                //};
                // Instantiate our timeLine object.
                timeLine = new links.Timeline(document.getElementById(timeLineId), options);
                scale = new links.Timeline(document.getElementById(scaleId), options2);
                links.events.addListener(timeLine, 'rangechange', onTimeLineRangeChange);
                //links.events.addListener(timeLine,"select",onSelect);
                links.events.addListener(scale, 'rangechange', onScaleRangeChange);
                Ext.defer(function () {
                    // Draw our timeLine with the created data and options
                    timeLine.draw(data);
                    scale.draw([{
                        "start": new Date(2012, 0, 1),
                        "content": "item 1",
                        "group": "hour2"
                    }]);
                    var today = new Date();
                    customTime = today;
                    currentTime = today;
                    timeLine.setCurrentTime(today);
                    scale.setCurrentTime(today);
                    changeCustomTime(today);
                    var timelineData=timeLine.getData();
                    Ext.Array.each(timeLine.items,function(item){
                        var itemContent=item.content;
                        var timelineRecord=Ext.Array.findBy(timelineData, function (arrayItem) {
                            return arrayItem.content===itemContent;
                        });
                        if(timelineRecord){
                            try{
                                item.dom.addEventListener("click", Ext.bind(function(contextItem,record){
                                    //me.fireEvent("timelineSelection",record);
                                    setDetailPanel(record);
                                },this,[item,timelineRecord]));

                            }catch(e){
                                console.log("error ", e);
                            }
                            try{
                                item.dom.addEventListener("dblclick", Ext.bind(function(contextItem,record){
                                    me.getEl().mask("Opening file...");
                                    me.fireEvent("timelineFileOpen",record,me);

                                },this,[item,timelineRecord]));

                            }catch(e){
                                console.log("error ", e);
                            }
                        }
                    });
                }, 500);

            });
            var setDetailPanel= function (record) {
                //console.log(record);
                //detailPanel.expand();
                //detailPropertyGrid.expand();
                var storeRecordQuery=timelineStore.queryBy(function (item) {
                    return item.get("uuid")===record.uuid;
                });
                if(storeRecordQuery){
                    var storeRecord=storeRecordQuery.items[0];
                    var content=storeRecord.get("content");
                    //console.log(storeRecord);
                    var propertyArray=[];
                    var commentField = Ext.widget("textarea", {
                        name:"comment",
                        fieldLabel: 'Comment',
                        height:200,
                        width:400,
                        //labelAlign:"right",
                        cls: "default-header-font-color",
                        allowBlank:false
                    });
                    Ext.Array.push(propertyArray,{
                        text:"Comment",
                        value:content.comment,
                        editable:false,
                        group:"data"
                        //editor:commentField,
                        /!*renderer: function (value) {
                            return '<div style="height: 100px;font-size: 16px;white-space:normal !important;" title="'+value+'">'+value+'</div>';
                        }*!/

                    });
                    Ext.Array.push(propertyArray,{
                        text:"Date",
                        value:storeRecord.get("start"),
                        editable:false,
                        group:"data",
                        renderer: function (value) {
                            var seconds=value.getSeconds();
                            var minutes=value.getMinutes();
                            var hours=value.getHours();
                            var date=value.getDate();
                            var month=value.getMonth()+1;
                            var year=value.getFullYear();
                            return date.toString()+"/"+month.toString()+"/"+year.toString()+" - "+(hours<10 ?"0":"")+hours.toString()+":"+(minutes<10? "0":"")+ minutes.toString()+":"+(seconds<10? "0":"")+ seconds.toString();
                        }
                    });
                    Ext.Array.push(propertyArray,{
                        text:"From",
                        value:Ext.getFormatDate(content.from),
                        editable:false,
                        group:"data"
                    });
                    Ext.Array.push(propertyArray,{
                        text:"Thru",
                        value:Ext.getFormatDate(content.thru),
                        editable:false,
                        group:"data"
                    });
                    //Ext.Array.push(propertyArray,{
                    //    text:"Time",
                    //    value:storeRecord.get("start"),
                    //    editable:false,
                    //    group:"data",
                    //    renderer: function (value) {
                    //        var hours=value.getHours();
                    //        var minutes=value.getMinutes();
                    //        var seconds=value.getSeconds();
                    //        return (hours<10 ?"0":"")+hours.toString()+":"+(minutes<10? "0":"")+ minutes.toString()+":"+(seconds<10? "0":"")+ seconds.toString()
                    //    }
                    //});
                    Ext.Array.push(propertyArray,{
                        text:"Name",
                        value:content.name,
                        editable:false,
                        group:"data"

                    });
                    Ext.Array.push(propertyArray,{
                        text:"Description",
                        value:content.description,
                        editable:false,
                        group:"data"

                    });
                    Ext.Array.push(propertyArray,{
                        text:"Action",
                        value:storeRecord.get("group"),
                        editable:false,
                        group:"data"

                    });
                    Ext.Array.push(propertyArray,{
                        text:"User",
                        value:content.userName,
                        editable:false,
                        group:"data"//,
                        //renderer: function (value) {
                        //    return '<div style="height: 110px;"><img style="border-radius: 35%;height:110px" src="'+value+'"></div>';
                        //}

                    });
                    Ext.Array.push(propertyArray,{
                        text:"Type",
                        value:storeRecord.get("content").fileType,
                        editable:false,
                        group:"data",
                        renderer: function (value) {
                            var record=me.attachmentTypeStore.findRecord("uuid",value);
                            return '<span class="'+Ext.manifest.globals.fontBasePrefix+Ext.getFileType(record.get("name"))+Ext.manifest.globals.fontBasePostfix+'"></span>';
                            //return '<span title="File type '+value.slice(0,-4)+'" style="font-size:16px;" class="'+Ext.manifest.globals.fontBasePrefix+value+'"></span><span>'+value.slice(0,-4)+'</span>';
                        }
                    });
                    detailPropertyGrid.setSource(propertyArray);
                }
            };
            me.callParent(arguments);
        },
        getDayRange: function (selectedDate) {
            var firstHour = new Date(selectedDate);
            var lastHour = new Date(selectedDate);
            firstHour.setHours(0, 0, 0, 0);
            lastHour.setHours(23, 59, 59, 0);
            return [firstHour, lastHour]
        },
        getWeekRange: function (selectedDate) {
            var lastMonday = new Date(selectedDate);
            var nextSunday = new Date(selectedDate);
            selectedDate.setHours(0, 0, 0, 0);
            lastMonday.setDate(selectedDate.getDate() - (selectedDate.getDay() - 1));
            lastMonday.setHours(0, 0, 0, 0);
            nextSunday.setDate(selectedDate.getDate() + (7 - selectedDate.getDay()));
            nextSunday.setHours(23, 59, 59, 0);
            return [lastMonday, nextSunday]
        },
        getMonthRange: function (selectedDate) {
            var lastDay;
            var firstDay = new Date(selectedDate);
            selectedDate.setHours(0, 0, 0, 0);
            firstDay.setDate(1);
            firstDay.setHours(0, 0, 0, 0);
            lastDay = new Date(firstDay);
            lastDay.setMonth(firstDay.getMonth()+1);
            lastDay.setDate(0);
            lastDay.setHours(23, 59, 59, 0);
            return [firstDay, lastDay]
        } */
});