/**
 * @author MYAX <mig_dj@hotmail.com>
 * date 11/4/2016
 * custom form panel
 */
/**
 * @class Ext.ux.widget.panel.Form
 * @extends Ext.form.Panel
 * @xtype customform
 * description
 */
Ext.define('Ext.ux.widget.panel.Form', {
  extend: 'Ext.form.Panel',
  xtype: 'customform',
  requires: ['Ext.ux.widget.panel.Panel'],
  layout: 'fit',
  // margin: 5,
  currentRecord: null,
  configDesign: {},
	/*
	 * @cfg {String} actionMode  `'new''` acction ["new", "update", "remove", "view"]
	 */
  actionMode: 'new',
  showConfidenceDialog: false,
  confidenceConfig: null,
  initComponent: function () {
    var me = this;
    var Elocale = Ext.localization.jsonPanel;



    me.confidenceConfig = me.stores.sourceStore.confidenceLevel;
    me.showConfidenceDialog = (me.confidenceConfig);

    var loadMask = new Ext.LoadMask({
      target: me
    }),
      validateForm = function (cardManager, button) {
        if (me.isValid()) {
          var gridList = me.query('customgridpanel') || [];
          var count = 0,
            valid = true;
          if (gridList.length) {
            for (var i = 0; i < gridList.length; i++) {
              var grid = gridList[i];
              if (grid.isValid()) {
                count++;
              } else {
                break;
              }
            }
            if (count !== gridList.length) {
              valid = false;
            }
          }
          if (valid) {
            me.stores.sourceStore.batchUpdateSources({
              check: true,
              noChanges: function (noChanges) {
                loadMask.hide();
                if (noChanges) {
                  button.showConfidence = me.showConfidenceDialog;
                  var uuidConfidenceLevel = (me.currentRecord && me.confidenceConfig) ? me.currentRecord.get(me.confidenceConfig.dataIndex) : null;
                  cardManager.fireEvent('showconfidence', button, me, uuidConfidenceLevel);
                } else {
                  me.showMessage(Elocale.msgText.noChanges, 'warning');
                }
              }
            });
          }
        } else {
          me.showMessage(Elocale.msgText.formInvalid, 'error');
        }
      },
      showErrorMessage = function (responseList) {
        responseList = responseList || [];
        var errorList = (responseList.length) ? responseList[0].error : [];

        if (errorList.length) {
          Ext.Array.each(errorList, function (error, index) {
            me.showMessage(error.message, 'error');
          });
        } else {
          me.showMessage(Elocale.msgText.errorSuccess, 'error');
        }
      };


    Ext.apply(me, {
      // padding: 5,
      defaultCallback: function (close) {
        loadMask.hide();
      },
			/**
			 * onSaveData description
			 * @private
			 */
      onSaveData: function (createAnother, justificacion, confidenceLevel) {
        var me = this;
        if (me.showConfidenceDialog) {
          me.confidenceConfig.value = confidenceLevel;
          me.stores.sourceStore.changeValueByGlobalParam(me.confidenceConfig);
        }
        var successCallback = function (response) {
          var responseText = Ext.JSON.decode(response.responseText);
          loadMask.hide();
          if (responseText.success) {
            me.showMessage(Elocale.msgText.saveSuccess);
            me.stores.sourceStore.history({
              action: me.actionMode,
              comment: justificacion,
              callback: function () {
                if (createAnother) {
                  // me.reset();
                  me.removeAll();
                  me.stores.sourceStore.createNewRowsForAll(false);
                  me.add(me.design);
                } else {
                  Ext.GlobalEvents.fireEvent('closeactivecard');
                }
              }
            });

          } else {
            showErrorMessage(responseText.response, 'error');
          }
        };

        loadMask.msg = Elocale.loadMaskMessage.saving;
        loadMask.show();
        me.stores.sourceStore.batchCreateSources({
          success: successCallback,
          callback: createAnother ? function () {
            me.clearInvalid();
          } : null,
          createAnother: createAnother,
          historical: me.historical
        });
      },
      'listeners': {
        'afterrender': function (panel) {

          me.add(me.design);
        },
        'closedesing': function () {
          // var me = this;
          // me.stores.sourceStore.on("changesVerified", function (hasChanged) {
          //     if (hasChanged) {
          //         Ext.Msg.confirm(Ext.localization.apiName, Elocale.msgText.formHasChanges, function (btn) {
          //             if (btn == 'yes') {
          //                 Ext.GlobalEvents.fireEvent('closeactivecard');
          //             }
          //         }, me);
          //     } else {
          //         Ext.GlobalEvents.fireEvent('closeactivecard');
          //     }
          // }, me, { single: true });

          // me.stores.sourceStore.verifySourceChanges(true);
        },
        'removerecord': function (justificacion, confidenceLevel) {
          var sourceStore = me.stores.sourceStore;
          var uuidRecord = sourceStore.getKeyRecord();
          var description = sourceStore.getRecordDescription(sourceStore.getMainSource());

          var successCallback = function (response) {
            var responseText = Ext.JSON.decode(response.responseText);
            loadMask.hide();
            if (responseText.success) {
              sourceStore.history({
                uuidRecord: uuidRecord,
                action: me.actionMode,
                comment: justificacion,
                description: description,
                callback: function () {
                  me.showMessage(Elocale.msgText.removeSuccess);
                  Ext.GlobalEvents.fireEvent('closeactivecard');
                }
              });
            } else {
              showErrorMessage(responseText.response);
            }
          };

          loadMask.msg = Elocale.loadMaskMessage.removing;
          loadMask.show();
          sourceStore.batchRemoveSources({
            'success': successCallback,
            'createAnother': false
          });
        },
        'beforeremoverecord': function (cardManager, button, panel) {
          Ext.Msg.confirm(Ext.localization.generic.warning, Elocale.msgText.removeRecord, function (btn) {
            // Ext.Msg.confirm(Ext.localization.apiName, Elocale.msgText.removeRecord, function (btn) {
            if (btn == 'yes') {
              cardManager.fireEvent('showconfidence', button, me);
            }
          }, me);
        },
        'beforesaverecord': function (cardManager, button, panel) {

          validateForm(cardManager, button);
        },
        'beforeupdaterecord': function (cardManager, button, panel) {
          validateForm(cardManager, button);
        },
        'beforesaveother': function (cardManager, button, panel) {
          validateForm(cardManager, button);
        },
        'updaterecord': function (justificacion, confidenceLevel) {
          var me = this;
          var successCallback = function (response) {
            var responseText = Ext.decode(response.responseText);
            loadMask.hide();
            if (responseText.success) {
              me.stores.sourceStore.history({
                action: me.actionMode,
                comment: justificacion,
                callback: function () {
                  me.showMessage(Elocale.msgText.updateSuccess);
                  Ext.GlobalEvents.fireEvent('closeactivecard');
                }
              });
            } else {
              showErrorMessage(responseText.response);
            }
          };

          loadMask.msg = Elocale.loadMaskMessage.updating;
          loadMask.show();

          if (me.showConfidenceDialog) {
            me.confidenceConfig.value = confidenceLevel;
            me.stores.sourceStore.changeValueByGlobalParam(me.confidenceConfig);
          }
          me.stores.sourceStore.batchUpdateSources({
            'success': successCallback,
            noChanges: function (noChanges) {
              if (noChanges) {
                loadMask.hide();
                me.showMessage(Elocale.msgText.noChanges, 'error');
              }
            }
          });
        },
        'saverecord': function (justificacion, confidenceLevel) {
          me.onSaveData(false, justificacion, confidenceLevel);
        },
        'saveother': function (justificacion, confidenceLevel) {
          me.onSaveData(true, justificacion, confidenceLevel);
        }
      }
    });

    me.callParent(arguments);
  },
  showMessage: function (msg, type, layout, delay) {
    Ext.Notify.msg(msg, {
      'layout': layout || 'bottomright',
      'delay': delay || 5000,
      'type': type || 'success'
    });
  },
	/**
	 * @method clearInvalid clear error because validations rules applied
	 * @private
	 */
  clearInvalid: function () {
    var me = this;
    var editorList = me.query("[xtype=universalField]");
    Ext.Array.each(editorList, function (editor, index) {
      if (editor.clearInvalid) {
        editor.clearInvalid();
      }
    });
  }
});