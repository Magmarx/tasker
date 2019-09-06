/**
* @author Created by MYAX on 6/5/2015.
* @class Ext.ux.locale.container.English
*/
Ext.define('Ext.ux.locale.container.English', {
    // TODO: validar carga de lenguajes
    singleton: true,
    constructor: function () {
        var Ex = Ext;
        /**
        * Clase que contiene las etiuquetas del container si el idioma seleccionado es inglés
        * @type {{}|*}
        */
        Ex.localization = Ex.localization || {};
        Ex.apply(Ex.localization, {
            'authentication': {
                "loginTitle": 'Welcome to Monitor Plus 5',
                "lockTitle": 'Session locked',
                "lockLabel": 'It\'s been a while. please enter your password to resume',
                "loginUsername": 'USER NAME',
                "loginPassword": 'PASSWORD',
                "keepsession": 'Keep open session',
                "rememberme": 'Remember me',
                "forgotpassword": 'Forgot Password ?',
                "language": 'LANGUAGE',
                "module": 'MODULE',
                "role": 'ROLE',
                "loginTextUnlock": 'Unlock',
                "loginTextCheck": 'Check',
                "loginTextLogin": 'Login',
                "signAnother": 'Sign in with another account'
            },
            'formula': {
                'valid': 'Valid formula',
                'invalid': 'Invalid formula',
                'validate': 'Validate'
            },
            'filterbar': {
                'isEqualTo': 'Is equal to',
                'isNotEqualTo': 'Is not equal to',
                'greatThanOrEqual': 'Great than or equal',
                'lessThanOrEqual': 'Less than or equal',
                'greatThan': 'Great than',
                'lessThan': 'Less than'
            },
            'mainGrid': {
                'maskText': {
                    'getConfig': 'Verifying grid configuration...',
                    'startUp': 'Starting Up'
                },
                'menuText': {
                    'fileText': 'File',
                    'recordText': 'Record',
                    'historicalText': 'Historical',
                    'addRecord': 'Add New Record',
                    'editRecord': 'Edit Selected Record',
                    'viewRecord': 'View Selected Record',
                    'removeRecord': 'Remove Selected Record',
                    'formatText': 'Format',
                    'relatedProgram': 'Related Programs'

                },
                'options': {
                    'generalHistory': 'General History',
                    'recordHistory': 'Record History',
                    'markColor': {
                        'text': 'Marked with Color',
                        'nocolor': 'No Color',
                        'red': 'Red',
                        'blue': 'Blue',
                        'green': 'Green',
                        'yellow': 'Yellow'
                    },
                    'markFlag': 'Marked with flag',
                    'filterByValue': 'Filter by value',
                    'orderColumnAsc': 'Sort Ascending',
                    'orderColumnDesc': 'Sort Descending',
                    'lockColumn': 'Freeze',
                    'unLockColumn': 'Unfreeze',
                    'groupBy': 'Group by This Field',
                    'comment': 'Add Comment',
                    'showGroup': 'Show groups'
                },
                'msg': {
                    'errorNoRow': '<div><b>Selection Error</b></div> <div> You must select at least one row to continue...</div>',
                    'errorRelatedPrograms': '<div><b>Selection Error</b></div> <div> You must select just one row to use the related programs</div>',
                    'errorLoad': '<div><b>Load Error</b></div><div><b>name: </b>',
                    'lostInformation': '',
                    'noRecord': 'No selected record'
                },
                'msgText': {
                    'deleteDesign': 'Are you sure you want to remove the current design? this action cannot be reverted.',
                    'deletingDesign': 'Deleting Design...',
                    'noDesignSelected': 'Please select a design first and then click this button again.',
                    'designNotDeleted': 'The current design cannot be removed please try again',
                    'designNotDeletedBy': 'The current design cannot be removed due: ',
                    'deletingItem': function (name, type) {
                        return "Are you sure you want to remove the '" + name + "' " + type + ', this action cannot be reverted.';
                    }
                },
                'type': {
                    'connection': 'connection'
                }
            },
            'additionalParameter': {
                'title': 'Monitor Plus Additional Parameters',
                'emptyText': 'None confidence level',
                'treeTitle': 'Confidence level',
                'fields': {
                    'comment': 'Comment'
                },
                'buttons': {
                    'save': 'Save',
                    'cancel': 'Cancel'
                }
            },
            'attachment': {
                'mask': {
                    'getVersions': 'Getting attachment versions...',
                    'update': 'Updating attachment state...',
                    'save': 'Saving attachment...',
                    'getTimeline': 'Loading attachment history',
                    'getComment': 'Loading comment data',
                    'getAttachment': 'Loading attachment data...',
                    'commentList': 'Verifying if the records have comments...',
                    'attachmentList': 'Verifying if the records have attachments...',
                    'validate': 'Validating...'
                },
                'button': {
                    'newVersion': 'Create New Version',
                    'approve': 'Approve',
                    'decline': 'Decline',
                    'showVersion': 'Show versions',
                    'pending': 'Pending',
                    'complete': 'Complete',
                    'tooltip': {
                        'close': 'Close comment panel',
                        'pin': 'Keep visible',
                        'unpin:': 'Hide panel'
                    }
                },
                'message': {
                    'privileges': "<p>You don't have privileges to perform any action over this record</p>",
                    'timelineCreate': 'Timeline  created successfully',
                    'timelineErrorSave': "Timeline didn't save because: ",
                    'thruDateError': 'The date must be grater than from date',
                    'successStateChange': 'Successfully changed the state of the file to ',
                    'failStateChange': "Attachment couldn't be updated record comment because: ",
                    'successAttach': 'File attached successfully',
                    'failAttach': "Attachment couldn't be created because: ",
                    'successVersionAttach': 'Attachment version created successfully',
                    'failVersionAttach': "Version couldn't be created because: ",
                    'validationForm': 'You have to enter de required fields',
                    'failFileType': "The file couldn't be uploaded, it is not soported",
                    'failFileSize': 'The file size is bigger than '

                }
            },
            'comment': {
                'newEmptyText': 'Type comments here...',
                'contextual': {
                    'remove': 'Remove comment'
                },
                'maskText': {
                    'save': 'Saving comment...',
                    'remove': 'Removing comment...',
                    'update': 'Updating comment data...',
                    'successUpdate': 'Comment updated',
                    'failUpdate': "Comment couldn't be updated record comment because: "
                },
                'button': {
                    'tooltipText': {
                        'save': 'Save Comment',
                        'close': 'Close comment panel',
                        'pin': 'Keep visible',
                        'unpin': 'Hide panel',
                        'scopeValue': {
                            'privateText': 'Private comment',
                            'publicText': 'Public comment'
                        }
                    }
                }
            },
            'dataStreamer': {
                'dynamicToolbar': {
                    'viewMenu': 'VIEW',
                    'compactMode': 'Compact Mode',
                    'standardMode': 'Standard Mode',
                    'analyticMode': 'Analytic Mode',
                    'modernMode': 'Modern Mode',
                    'goMenu': 'GO',
                    'nextPage': 'Next Page',
                    'previousPage': 'Previous Page',
                    'firstPage': 'First Page',
                    'lastPage': 'Last Page',
                    'refreshPage': 'Refresh Page'
                }
            },
            'simpleStyleConfig': {
                'fieldLabel': {
                    'width': 'Width',
                    'height': 'Height',
                    'borderTitle': 'Border',
                    'borderSize': 'Border Size',
                    'borderStyle': 'Border Style',
                    'borderStyleValue': {
                        'solidText': 'Solid',
                        'dashedText': 'Dashed',
                        'dottedText': 'Dotted',
                        'doubleText': 'Double'
                    }
                }
            },
            'translationDialog': {
                'title': 'Translation Center',
                'comboLanguage': 'Reference Language',
                'grid': {
                    'column': {
                        'referenceName': 'Label Name',
                        'translation': 'Translation to ',
                        'reference': 'Traduction in ',
                        'laguage': 'Language',
                        'status': 'Status',
                        'flag': 'Icon',
                        'edit': 'Edit'
                    },

                    'groupHeaderText': {
                        'type': 'Type',
                        'option': {
                            'menu': 'Menu',
                            'design': 'Design'
                        }
                    },
                    'panel': {
                        'status': 'Translation status',
                        'label': 'Labels translation'
                    }

                },
                'panel': {
                    'setting': 'Setting Translation'
                },
                'tree': {
                    'title': 'Menu in'
                },
                'button': {
                    'save': 'Save translations',
                    'close': 'Close',
                    'back': 'Back'
                },
                'message': {
                    'closeConfirm': 'Are you sure you want to exit without save?',
                    'saved': 'Translation is saved successfully',
                    // ""
                    'comboChange': 'Are you sure you want to change value? all unsaved changes would be lost.',
                    'errorConnection': 'The connection with the server was lost or may be down, please try again in a few minutes'
                }
            },
            'publishDialog': {
                'title': {
                    'window': 'Publish Design'
                },
                'fieldLabel': {
                    'nameField': 'Name',
                    'descriptionField': 'Description',
                    'templateField': 'Default Template',
                    'secureConnection': 'Connection to publish',
                    'askForParametersField': 'Always ask for the parameters at the start'
                },
                'emptyText': {
                    'nameField': 'Type the name that will be shown in the menu option',
                    'secureConnection': '    a connection to publish',
                    'descriptionField': 'Type a description of the published design'
                },
                'msgText': {
                    'publishing': 'Publishing Design',
                    'labelExist': 'The label already exist, please change this label.',
                    'noNodeSelect': 'You must select a node to add',
                    'notAddMenu': 'You can not add a menu path to an item.',
                    'doNotRemove': 'You can not remove menu because this have items menu.',
                    'menuModeRead': 'This menu is read only.',
                    'saveOk': 'Has been published successfully design.',
                    'tryAgain': 'The connection with the server was lost or may be down, please try again in a few minutes'
                },
                'tooltip': {
                    'addFolder': 'Add Child Folder',
                    'removeItem': 'Remove Current Item',
                    'publishHere': 'Publish at Location'
                },
                'buttons': {
                    'publish': 'Publish',
                    'cancel': 'Cancel',
                    'delete': 'Delete',
                    'ok': 'Ok'
                },

                'window': {
                    'title': 'Label'
                },
                'tree': {
                    'nodeRoot': 'Menu Structure',
                    'contextualMenu': {
                        'publishHere': 'Publish Menu Here',
                        'addNewMenuGroup': 'Add New Menu',
                        'removeMenu': 'Remove current item',
                        'editLabel': 'Edit Label'
                    },
                    'chekboxModeGen': 'Create label generic for menu',
                    'editor': {
                        'title': 'New Item Menu',
                        'labelName': 'Label Name',
                        'save': 'Save',
                        'cancel': 'Cancel',
                        'validate': 'Validate'
                    },
                    'expandAll': 'Expand All',
                    'collapseAll': 'Collapse All'
                }

            },
            'schedule': {
                'addSchedule': 'Add Schedule',
                'from': 'From',
                'to': 'To:',
                'allDay': 'All day',
                'addEvent': 'Add',
                'editEvent': 'Edit',
                'availableHours': 'Available hours',
                'needSchedule': 'You need to have less than one day set on schedule'
            },
            'dayWeek': {
                'sunday': 'sunday',
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday'
            },
            'field': {
                'msgText': {
                    'multipleRow': "This text field is showing <b style='color:red;'>ONLY</b> the first row on the data source, to view the rest of the rows please create a data grid"
                }
            },
            'bigMenu': {
                'buttonText': {
                    'help': 'Help',
                    'settings': 'Settings',
                    'taskManager': 'Task Manager',
                    'logOut': 'Log Out',
                    'lock': 'Lock',
                    'appTree': 'Tree Menu',
                    'appRecent': 'Recent Menu',
                    'appFavorite': 'Favorite Menu',
                    'style': 'Select Menu Style'
                },
                'currentMenuViewFavorite': 'Favorite menu view',
                'currentMenuViewAll': 'All menu view'
            },
            'jsonPanel': {
                'instanceMode': {
                    'viewText': 'View Mode',
                    'newText': 'Create New',
                    'updateText': 'Update Mode',
                    'deleteText': 'Remove Mode',
                    'removeText': 'Remove Mode'
                },
                'buttons': {
                    'updateText': 'Update',
                    'newText': 'Save New',
                    'saveOtherText': 'Save Another',
                    'cancelText': 'Cancel',
                    'fileText': 'File',
                    'recordText': 'Record'
                },
                'msgText': {
                    'saveSuccess': 'Record successfully saved',
                    'updateSuccess': 'Record successfully updated',
                    'removeSuccess': 'Record successfully removed',
                    'errorSuccess': 'An error has occurred on data transaction.  Contact your system administrator for more information.',
                    'updating': 'Updating Please Wait...',
                    'tryAgain': 'Please Try Again',
                    'formInvalid': 'There are some errors in the form, place your mouse pointer over the red fields to see the error detail.',
                    'formHasChanges': 'There are some changes in the form, are you sure to cancel the changes?',
                    'removeRecord': 'Are you sure you want to remove the current record?  This action cannot be reverted.',
                    'informationMissing': 'You must complete the required fields.',
                    'cancel': 'Cancel changes'
                },
                'loadMaskMessage': {
                    'reading': "Reading...",
                    "waiting": 'wait...',
                    "removing": "Removing...",
                    "updating": "Updating...",
                    "saving": "Saving..."
                }
            },
            'universalField': {
                'combobox': {
                    'clearMessage': 'To clean this value all associated values ​​are deleted. You want to do this?',
                    'clearTitle': 'Warning',
                    'previewMode': 'You need to enter in Preview Mode to see the lookup data'
                }
            },
            'loadDesign': {
                'loadText': {
                    'initializing': 'Initializing...',
                    'loadingWindowTitle': 'Please Wait',
                    'gettingDesign': 'Getting Design...',
                    'gettingReady': 'Getting Ready...',
                    'loadingDesign': 'Loading Design...',
                    'loadingConnections': 'Loading Connections...',
                    'loadingParameters': 'Loading Parameters...',
                    'loadingDataSources': 'Loading DataSources...',
                    'chargingDesignData': 'Charging Design Data...',
                    'openingConnections': 'Opening Connections...',
                    'settingParameters': 'Setting Parameters...',
                    'rollingBack': 'Rolling Back...'
                },
                'msgText': {
                    'loadedDesignNoLongerExists': 'It seems that the design you try to load no longer exists, please verify and try again'
                }
            },
            'criteriaPanel': {
                'msgText': {
                    'selectFieldValueFirst': 'You must select field value first',
                    'selectRowToDeleteFirst': 'Please select a row to remove first.'
                },
                'column': {
                    'connector': 'Conector',
                    'field': 'Field',
                    'operator': 'Operator',
                    'value': 'Value',
                    '_delete': 'Del',
                    'edit': 'Edit',
                    'config': 'Configuration'
                },
                'validateValueExpression': {
                    'typeMismatch': 'Value types mismatch, please check entered data',
                    'selectFieldFirst': 'You must select field value first.',
                    'valueDoesNotExist': function (store) {
                        return "Value doesn't exists in " + store + ' Store';
                    }
                }
            },
            'detailBubble': {
                'defaultTitle': '<b>The following errors prevent to continue the process</b>',
                'errorGroup': {
                    'defaultGroup': 'Default'
                },
                'msgText': {
                    'noDataToDisplay': 'No Data To Display'
                }
            },
            'parameterSetupDialog': {
                'title': {
                    'parameters': 'Parameters'
                },
                'advancedSearchTooltip': 'Show Advanced Search Dialog',
                'advancedSearchFieldsTitle': 'Search Fields',
                'buttonText': {
                    'search': 'Search',
                    '_continue': 'Continue',
                    'cancel': 'Cancel',
                    'clear': 'Clear Search'
                },
                'buttons': {
                    '_continue': 'Continue',
                    'searchIt': 'Search It...',
                    'cancel': 'Cancel'
                },
                'msgText': {
                    'noCriteria': 'You must insert at least one search criteria in the gird.',
                    'noRecordSelected': 'You must select a row from the result grid.',
                    'allFieldsRequired': 'All fields are required',
                    'selectRecord': "Select records first"
                }
            },
            'gridPanel': {
                'buttons': {
                    'downloadXLS': 'Download as .XLS',
                    'okEdit': 'Ok',
                    'cancelEdit': 'Cancel',
                    'addRecord': 'Add new record',
                    'removeRecord': 'Delete this record',
                    'editRecord': 'Edit this record'
                },
                'editing': 'Editing...',
                'msgText': {
                    'noSourceMessage': 'There is a problem on connecting to the current data Store, please verify the settings and try again',
                    'noDataInEditMode': 'Data wont display in edit mode, press the preview button to see the current data.',
                    'noDataToDisplay': 'No data to display.',
                    'duplicated': 'Duplicated!'
                }
            },
            'searchPanel': {
                'label': {
                    'showMore': 'Show More'
                },
                'staticGroupName': {
                    'mathResult': 'Math Operation Result'
                }
            },
            'timeLine': {
                'button': {
                    'dayMode': 'Day',
                    'weekMode': 'Week',
                    'monthMode': 'Month'
                },
                'parameterWindow': {
                    'title': 'Parameters to create timeline',
                    'selectedMenuPanel': 'Selected menus',
                    'menuList': 'Menu list',
                    'form': {
                        'label': {
                            'position': 'Timeline Position',
                            'from': 'From',
                            'thru': 'Thru',
                            'valuePicker': 'Get last'
                        }
                    },
                    'button': {
                        'ok': 'Ok',
                        'cancel': 'Cancel',
                        'selectAll': 'Select all menus',
                        'removeAll': 'Remove all menus'
                    },
                    'valueLabel': 'Days',
                    'removeText': 'Remove',
                    'messageBoxMsg': 'Getting historical data please wait...',
                    'messageBoxProgressText': 'Sending...',
                    'waitMessage': 'Loading data...',
                    'timelineTabTitle': 'Timeline Multi View',
                    'noResultsPanel': '<h4>Your search did not return any result</h4><h5>please redefine your search...</h5>',
                    'waitWindowMsg': 'Getting historical data, please wait...',
                    'waitWindowProgressText': 'Sending...',
                    'waitWindowText': 'Loading data...'
                },
                'multiViewPanel': {
                    'timelineGrid': {
                        'emptyText': 'No records to display',
                        'messageBox': {
                            'msgText': 'Generating timeline view, please wait...',
                            'progressText': 'Sending...',
                            'waitMessage': 'Drawing data...'
                        },
                        'columnText': {
                            'action': 'Action',
                            'comment': 'Comment',
                            'menuDescription': 'Menu Description',
                            'menuName': 'Menu Name',
                            'recordDescription': 'Record Description',
                            'recordName': 'Record Name',
                            'username': 'Username',
                            'date': 'Date',
                            'module': 'Module',
                            'role': 'Role',
                            'data': 'Data'
                        }
                    },
                    'timeline': {
                        'filteredTitle': 'The data is filtered by the criterion: ',
                        'timelineViewTooltip': 'Change to timeline view',
                        'gridViewTooltip': 'Change to grid view',
                        'normalUserTitle': 'Record information',
                        'advancedPanelTitle': 'Record snapshot',
                        'originalPanelTitle': 'Original record',
                        'updatedPanelTile': 'Updated record',
                        'comparePanelText': 'Modified fields',
                        'compareButtonTooltip': 'Compare changes',
                        'snapshotButtonTooltip': 'Snapshot view',
                        'advancedButtonTooltip': 'Advanced view',
                        'normalViewTooltip': 'Normal view'

                    }
                },
                'timelinePanel': {
                    'userComboEmptyText': 'Select an user',
                    'roleLabel': 'Role',
                    'roleComboEmptyText': 'Select a role',
                    'timezoneLabel': 'Timezone',
                    'timezoneComboEmptyText': 'Select a timezone',
                    'actionLabel': 'Action',
                    'actionComboEmptyText': 'Select an action',
                    'commentLabel': 'Comment',
                    'commentComboEmptyText': 'enter comment',
                    'additionalFilterPanelTitle': 'Filter by',
                    'searchButtonText': 'Search',
                    'titleText': 'Detail for',
                    'maskText': 'Generating timeline view',
                    'detailPanel': {
                        'commentText': 'Comment',
                        'dateText': 'Date',
                        'fromText': 'From',
                        'thruText': 'Thru',
                        'nameText': 'Name',
                        'descriptionText': 'Description',
                        'actionText': 'Action',
                        'userText': 'User',
                        'typeText': 'Type',
                        'propertyGridTitle': 'Timeline item detail'
                    }
                }
            },
            'mainMenu': {
                'itemLabel': {
                    'favorites': 'Favorites',
                    'widgets': 'Widgets',
                    'administrativeTools': 'Admin Tools',
                    'translationCenter': 'Translation Center',
                    'recents': 'Recents',
                    'more': 'Show more',
                    'showLog': 'Show Log',
                    'parentRelationship': 'Parent Relationship',
                    'displayFormat': 'Display Formats'
                },
                'contextMenu': {
                    'openItem': 'Open this menu item on a tab',
                    'addToFavorites': 'Add this menu item to favorites'
                }
            },
            'container': {
                'menuLabel': {
                    'openTab': 'Go to this tab',
                    'addToFavorites': 'Add this tab to favorites',
                    'closeTab': 'Close this tab'
                },
                'translationcenter': 'Translation center',
                'generalhistorical': 'General historical',
                'setting': 'Setting',
                'lock': 'Lock',
                'logout': 'Logout',
                'search': 'Search',
                'title': {
                    'accessLog': 'Access Log'
                },
                'tooltips': {
                    'hideSidebarPanel': 'Hide this panel'
                },
                'sessionExpired': '<div><b>The system closed the session because: </b></div>',
                'msgText': "System it's going to restart because: ",
                'msgTitle': 'Session Information',
                'mainViewPortMsg': 'Session ended due to inactivity...',
                'mainViewPortTitle': 'Session Information',
                'contextMenu': {
                    'move2left': 'Move to Left',
                    'move2right': 'Move to Right',
                    'restore': 'Restore',
                    'go2multiView': 'Go To Multiview'
                }
            },
            'login': {
                'loginBoss': {
                    'noBosses': "You don't have any boss assigned. The flag of loginBoss is activated. Update the permissions of the group.",
                    'noBossAssigned': "You don't have any boss assigned. Go to group users and update the permissions of the group."
                }
            },
            'notifications': {
                'toolbar': {
                    'notifications': '<b>Notifications</b>',
                    'today': '<b>Today</b>',
                    'markAllRead': 'Mark all as read',
                    'addNew': 'Add New'
                },
                'dateText': function (todayDate) {
                    return Ext.Date.format(todayDate, 'l, F jS ');
                },
                'title': {
                    'reminders': 'Reminders',
                    'calendar': 'Calendar',
                    'tomorrow': 'Tomorrow',
                    'news': 'News'
                }
            },
            'apiLicenseText': '/!* Monitor Plus Architect - Powered by MonitorPlus *!/',
            'apiVersion': '1.5',
            'apiName': 'Monitor Plus',
            'apiFooter': 'Copyright (C) 2000-2012, Plus Holding International Limited. All Rights Reserved.',
            'msgText': {
                'all': 'ALL',
                'somethingWrong': 'Something goes wrong please try again.',
                'invalidForm': 'One or more required fields on the form were not filled, check the information and try again.',
                'errorHeader': 'Error',
                'warningHeader': 'Warning'
            },
            'buttons': {
                '_add': 'Add',
                'remove': 'Remove',
                'cancel': 'Cancel',
                '_ok': 'Ok',
                '_back': 'Back',
                'save': 'Save'
            },
            'floatingActions': {
                'confirm': 'Confirm',
                'saverecord': 'Save record',
                'updaterecord': 'Update record',
                'deleteRecord': 'Delete record',
                'saveanother': 'Save ahother'
            },
            'menu': {
                'favorites': {
                    'msg': {
                        'add': 'Successfully added to favorites',
                        'fail': "Favorite couldn't be added because: ",
                        'remove': 'Successfully removed from favorites',
                        'failRemove': "Favorite couldn't be remove because: "
                    },
                    contextual: {
                        'add': 'Add to favorites',
                        'remove': 'Remove from favorites'
                    }
                },
                'favoriteMenuText': 'Favorite menu',
                'recentMenuText': 'Recent menu',
                'regularMenuText': 'Normal menu',
                'treeMenuText': 'Tree menu',
                'allMenuTooltip': 'Show all menus',
                'showFavoriteMenu': 'Show favorite menus',
                'showFavoriteView': 'Show favorite menu view',
                'showTreeView': 'Show tree view',
                'widgets': 'Widgets',
                'recents': 'Recents',
                'menu': 'Menu',
                'edit': 'Edit',
                'remove': 'Remove',
                'clone': 'Clone',
                'list': 'List',
                'more': 'Show more...',
                'showLog': 'Show Log',
                'user': 'User',
                'logout': 'Log out',
                'help': 'Help',
                'aboutus': 'About Monitor 5',
                'password': 'Password',
                'sessionExpires': function (time) {
                    return '<div>Session expires </div><div>on ' + (Ext.containerSettings.timeAfterLock - time) + ' seconds</div>';
                },
                'unlock': '<span style ="color: white; top: 2px; position: relative;" > UnLock</span>'
            },
            'crud': {
                'category': 'Category',
                'name': 'Name',
                'description': 'Description',
                'detail': 'Detail',
                'code': 'Code',
                'domain': 'Domain',
                'tlength': 'Length'
            },
            'confidenceLevel': {
                'type': 'Type',
                'list': 'List',
                'levelCreated': 'Level successfully created',
                'failedToCreateLevel': 'Failed to create level',
                'sizeNodesExceeded': 'Size of nodes have exceeded',
                // confidence level dialog.
                'selectLevel': 'You must select a confidence level',
                'loadingLevels': 'Loading confidence levels...',
                'titlePanel': 'Confidence level',
                'commentField': 'Comment',
                'treeEmptyText': 'None confidence level'
            },
            'generic': {
                'yes': 'If',
                'else': 'Else',
                'save': 'Save',
                'attachment': 'Attachment',
                'comment': 'Comment',
                'false': 'False',
                'true': 'True',
                'landing': 'Landing...',
                'updating': 'Updating...',
                'saving': 'Saving...',
                'deleting': 'Deleting...',
                'successsave': 'Success save',
                'updated': 'Updated',
                'deleted': 'Deleted'
            },
            'panelMore': {
                'importText': 'Import',
                'manageText': 'Manage',
                'searchText': 'Search'
            },
            'dataSourceStore': {
                'configurationLoadFailure': function (failSource) {
                    return '<b>Configuration Load Failure</b>: <cite>Cannot bind a connection to the following Source: ' + failSource + ' the load proccess wont continue</cite>';
                }
            },
            containerController: {
                logOutMaskText: 'Login out...',
                notificationMessage: "<div><b>Authentication Info</b></div><div>You have logged out of system...</div><div>For security reasons systems it's going to restart</div>",
                errorMessage: '<div><b>Authentication Info</b></div>'
            },
            'settings': {
                'title': 'Options',
                'loader': 'Loading... settings',
                'loadersaving': 'Saving... settings',
                'successSave': 'Saved successful',
                'categories': {
                    'Settings': 'Options',
                    'user': 'User',
                    'menu': 'Menu',
                    'historical': 'Historical'
                },
                'sections': {
                    'User': 'User',
                    'Theme': 'Theme',
                    'General': 'General'
                },
                'fields': {
                    'label': {
                        'maxTabs': 'Max Simultaneous Opened Tabs',
                        'homeMenuStyle': 'Home menu style',
                        'maxRecent': 'Recent List Size',
                        'maxFavs': 'Favorite List Size',
                        'timeBeforeLock': 'Time before lock application',
                        'alivePinTick': 'Ticks before sending alive pin (Every tick is 5s)',
                        'remainderTime': "Seconds before ending session when it's locked",
                        themeColor: 'Theme color',
                        'themeListButton': 'Button',
                        'themeListProgress': 'Progress',
                        'themeListPanel': 'Panel',
                        'themeListWindow': 'Window',
                        'themeListTab': 'Tab',
                        'containerSettingsPanel': "<b style='font-size:25px; line-height: 30px;'><i>Container Settings</i></b>",
                        'menuPanel': "<b style='font-size:25px; line-height: 30px;'><i>Menu settings</i></b>",
                        'themePanel': "<b style='font-size:25px; line-height: 30px;'><i>Theme settings</i></b>",
                        'generalPanel': "<b style='font-size:25px; line-height: 30px;'><i>General settings</i></b>",
                        marqueeName: 'Name',
                        marqueeDescription: 'Description',
                        marqueeValue: 'Text',
                        marqueeSplitter: 'Splitter',
                        marqueeOptionsPanel: 'Marquee options',
                        marqueeAddButtonTooltip: 'Add new record',
                        marqueeRecordsPanel: 'Marquee existing records',
                        marqueeIndex: 'Index',
                        marqueeEmptyText: '<h1><b>Select a category</b></h1>',
                        deleteMarqueeRecord: 'Delete record'
                    }
                }
            },
            'expressionCriteria': {
                'columns': {
                    'connector': 'Connector',
                    'field': 'Field',
                    'operator': 'Operator',
                    'value': 'Value'
                },
                'buttons': {
                    'addRow': 'Add Row',
                    'removeRow': 'Remove Row',
                    'removeParenthesis': 'Remove Parenthesis',
                    'addParenthesis': 'Add Parenthesis',
                    'narrative': 'Show Narrative',
                    'comment': 'Comment',
                    'changeDescription': 'Change description',
                    'shortDescription': 'Short Description',
                    'description': 'Description'
                },
                'tab': {
                    'property': 'Property',
                    'reference': 'Reference',
                    'search': 'Search'
                },
                'msg': {
                    removeRow: 'Are you sure to remove the row?',
                    clearCriteria: '',
                    invalidGroup: '',
                    groupAlreadyExist: 'The group already exists',
                    cannotIntersect: 'Can not intersect',
                    cannotGroup: 'Can not group',
                    dragAndDrop: 'Drag and drop',
                    completeRow: 'You must complete the row: ',
                    invalidType: 'The data type does not match'
                }
            },
            'dynamicTable': {
                'msgTitle': {
                    'warning': 'Warning!',
                    'confirm': 'Confirm'
                },
                'errorMsg': {
                    'alterateDefinition': 'Doing this action will alterate the definition of the relations',
                    'atLeastOnePrimaryKey': 'There must be at least one primary key in the fields',
                    'allFieldsRelated': 'All fields should be related to a field of an event',
                    'notTheSameRelation': "There can't be another relation with the same definition",
                    'dynamicTableAtLeastOneField': 'Dynamic table must have at least 1 field',
                    'dynamicTableAtLeastOneRelation': 'Dynamic table must have at least 1 relationship with an event',
                    'dynamicTableZeroFields': 'All relations should have at least 1 field. Set a field as primary key',
                    'dynamicTableAllFieldsRelated': 'All fields in a relation should be related to an event field. Update your relations'
                },
                'infoMsg': {
                    'deleteRelation': 'Want to delete the relationship?',
                    'saveSuccess': 'Record successfully saved',
                    'updateSuccess': 'Record successfully updated',
                    'deleteSuccess': 'Record successfully deleted',
                    'desencryptSuccess': 'Data desencrypted successfully',
                    'updateFail': 'Update failed',
                    'deleteFail': 'Delete failed',
                    'saveFailed': 'Save failed',
                    'pleaseWait': 'Please wait...'
                }
            },
            'cardManager': {
                'buttons': {
                    'navigation': 'Navigation',
                    'actions': 'Actions',
                    'next': 'Next',
                    'previous': 'Previous',
                    'save': 'Save'
                },
                'dashboard': 'Dashboard',
                'menucard': 'Menu Card',
                'recent': 'Recents',
                'windowCompare': {
                    'title': 'Compare',
                    'chooseRegister': 'Choose a register'
                },
                'confirmation': 'Confirmation',
                'sureToClose': "You haven\'t saved changes. Are you sure of closing it?",
                'sureToMakeAction': 'Are you sure of making this action?',
                'yes': 'Yes'
            },
            'history': {
                'successSave': 'History saved successfully',
                'failSave': 'There was an error'
            },
            'generalTranslations': {
                'msg': {
                    'pleaseAddNode': 'Please enter node name:',
                    'pleaseAddLevel': 'Please enter level name:',
                    'removeNode': 'Are your sure to delete the node?',
                    'onlyNumbersAndLetters': 'Only numbers and letters are permitted in the name',
                    'confirmation': 'Confirmation',
                    'confirmationUpdateRecord': 'Want to update this record?',
                    'confirmationDeleteRecord': 'Are you sure to delete the record?',
                    'relationshipSuccess': 'Relationship successfully created',
                    'relationshipFail': 'Relationship failed',
                    'notPermittedRelationship': 'This relationship is not permitted'
                }
            },
            'viewerAlert': {
                'displayFieldLastUpdated': '<b>Last updated</b>',
                'tagFieldFilterApplied': '<b>Filters applied</b>',
                'displayFieldQueue': '<b>Queue</b>',
                'displayFieldGroupBy': '<b>Group by</b>',
                'dateFieldDate': 'Date',
                'timeFieldTime': 'Time',
                'comboResultType': 'Result type',
                'comboActionTaken': 'Action taken',
                'comboPendingType': 'Pending type',
                'textAreaResult': 'Result of the investigation',
                'qualifyButton': 'Qualify as ',
                'contextMenu': {
                    'view': 'View',
                    'userData': 'View user data',
                    'transactionDetail': 'View transaction detail',
                    'profile': 'View profile',
                    'transfer': 'Transfer recipient',
                    'perform': 'Perform routine',
                    'transactionDetailRange': 'View transaction detail by range',
                    'pending': 'Pending',
                    'qualifiy': 'Qualify alerts',
                    'requalify': 'Requalify alerts',
                    historical: 'View historical of qualification'
                },
                'menu': {
                    'dataCategories': 'Data categories filter',
                    'all': 'All',
                    'pending': 'Pending',
                    'toMe': 'Assigned to me',
                    'toMyRole': 'Assigned to my role',
                    'unseen': 'Unseen alerts',
                    'viewed': 'Viewed alerts',
                    'notQualified': 'Not qualified alerts',
                    'qualified': 'Qualified alerts',
                    'groupBy': 'Group by this column'
                },
                'ok': 'Ok',
                'reset': 'Reset',
                'cancel': 'Cancel',
                'queue': 'Queue: ',
                'operator': 'has',
                'operators': {
                    'eq': 'is equal to',
                    'ne': 'distinct than',
                    'gte': 'great than or equal',
                    'lte': 'less than or equal',
                    'gt': 'great than',
                    'lt': 'less than',
                    'like': 'has'
                },
                'operatorDescription': 'is in queue ',
                'user': 'User ',
                'searchIn': 'Search in ',
                'active': 'Active',
                'description': 'Description',
                'elapsed': 'Elapsed time',
                displaying: 'Displaying',
                records: 'records',
                'title': {
                    'detail': 'Detail of ',
                    'chart': 'Chart panel',
                    'from': 'From',
                    'to': 'To',
                    'qualified': 'Qualified as ',
                    'dataFiltered': 'Data filtered by',
                    'activeAlerts': 'Active alerts',
                    'transactionDetail': 'Transaction detail of '
                },
                'configuration': {
                    'structure': 'Structure viewer alert',
                    'events': 'Select events',
                    'title': 'Viewer alert configuration window'
                },
                'mask': {
                    'gettingEvents': 'Getting events for struct viewer alert ',
                    'struct': 'Getting struct viewer alert...',
                    'transactionDetail': 'Getting transaction detail...',
                    'groupedData': 'Getting grouped data...',
                    'qualifying': 'Qualifying alert as ',
                    'config': 'Configuring the viewer...',
                    qualificationHistory: 'Getting history for qualification...'
                },
                columns: {
                    alertCondition: 'Alert conditions'
                },
                tooltip: {
                    compact: 'Compact view',
                    comfortable: 'Comfortable view',
                    close: 'Close viewer alert',
                    excel: 'Export to excel',
                    dontHave: "isn't",
                    have: 'is',
                    changeRegular: 'Change to regular view',
                    changeGrouped: 'Change to grouped view',
                    alertQueue: 'Alert queue'
                },
                msg: {
                    alertOf: ' alert of',
                    loadError: '<b>Load error:</b> ',
                    blockedAlert: "You cant't work on this alert becacuse <b>it's locked</b>",
                    locked: 'Locked',
                    unlocked: 'Unlocked'
                }
            },
            structureViewerAlert: {
                toolbar: {
                    event: 'Event properties',
                    columns: 'Columns',
                    sortAndGroup: 'Sort and group order',
                    general: 'General properties',
                    qualification: 'Qualification properties',
                    summary: 'Summary',
                    previous: 'Previous',
                    next: 'Next',
                    save: 'Save',
                    cancel: 'Cancel'
                },
                name: 'Name',
                description: 'Description',
                wcf: 'Web service',
                method: 'Method',
                actionTaken: 'Action taken',
                resultType: 'Result type',
                pendingType: 'Pending type',
                searchField: 'Search a registry',
                editable: 'Editable',
                automaticCalculation: 'Automatic calculation',
                visible: 'Visible',
                eventIcon: 'Registry icon',
                eventColor: 'Registry color',
                eventField: 'Search registry fields by registry code or description',
                alertField: 'Search alert fields by description',
                scoreField: 'Search score fields by registry code or description',
                selectColumn: 'Select a column',
                groupColumn: 'Group',
                valuesColumn: 'Values',
                textColumn: 'Text',
                closeButton: 'Close',
                saveButton: 'Save',
                deleteButton: 'Delete',
                resetButton: 'Reset',
                addButton: 'Add',
                cancelButton: 'Cancel',
                urgencyButton: 'Urgency field',
                dateField: 'Date field',
                propertyName: 'Name',
                generalPropertiesGroup: 'General properties',
                headerColumnGroup: 'Header columns',
                columns: 'Columns',
                applyButton: 'Apply',
                styleButton: 'Style',
                configButton: 'Config',
                removeButton: 'Remove',
                selectValue: 'Select a value',
                okButton: 'Ok',
                descriptionText: 'Description',
                descriptor: 'Descriptor',
                rowIdentifier: 'Row identifier',
                mainScore: 'Main score',
                availableBalance: 'Available balance',
                transactionAmount: 'Transaction amount',
                eventName: 'Registry',
                eventGroup: 'Records',
                tooltip: {
                    removeRecord: 'Remove column record',
                    gridSettings: 'Activity grid settings'
                },
                mask: {
                    saved: 'All data saved...',
                    eventValidation: 'You must select at least one registry',
                    selectedEvent: 'You must select at least one selected registry',
                    grupConfimationTitle: 'Remove group column?',
                    groupConfirmationMessage: 'You have column ',
                    groupConfirmationMessageCont: 'configured as grouper, do you want to remove it?',
                    save: 'Saving structure viewer data...',
                    loadEvents: 'Loading records...',
                    fieldEvent: 'Getting fields for records...',
                    researchIndicators: 'Loading research indicators...',
                    getMethods: 'Getting methods...'
                },
                title: {
                    qualificationProperties: ' qualification properties',
                    qualificationSection: 'Qualification section',
                    eventProperties: 'Registry properties configuration',
                    columnStyle: 'Column style customization',
                    columnConfigurationFor: 'Column configuration for ',
                    params: 'Params',
                    parametersForMethod: 'Parameters for method ',
                    removeGroupColumn: 'Remove group column?',
                    generalSection: 'General section',
                    selectedEvents: 'Selected registros',
                    eventField: 'Registry fields',
                    alertField: 'Alert fields',
                    scoreField: 'Score fields',
                    columnConfiguration: 'Column configuration',
                    headerColumns: 'Header columns',
                    detailColumns: 'Detail columns',
                    headerAndSort: 'Header and sort order',
                    detailSort: 'Detail sort order',
                    structureProperties: 'Structure viewer properties',
                    researchIndicatorSection: 'Research indicator section',
                    fieldSection: 'Fields section',
                    qualificationConfiguration: 'Qualification configuration',
                    structureSummary: 'Structure viewer summary'
                }
            }
        });

        this.fireChanges();

        return {};
    },
    fireChanges: function () {
        Ext.GlobalEvents.fireEvent('mainloadtranslate');
        Ext.GlobalEvents.fireEvent('authenticationloadtranslate');
    }
});
