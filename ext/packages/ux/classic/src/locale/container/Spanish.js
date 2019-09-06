/**
* @author hmorjan on 27-Apr-16.
* @class Ext.ux.locale.container.Spanish
*/
Ext.define('Ext.ux.locale.container.Spanish', {
    // TODO: validar carga de lenguajes
    singleton: true,
    constructor: function () {
        Ext.localization = Ext.localization || {};
        Ext.apply(Ext.localization, {
            'authentication': {
                "loginTitle": 'Bienvenido a Monitor Plus 5',
                "lockTitle": 'Sesión bloqueada',
                "lockLabel": 'Ha pasado un tiempo. Por favor ingrese su contraseña para continuar',
                "loginUsername": 'USUARIO',
                "loginPassword": 'CONTRASEÑA',
                "keepsession": 'Mantener sesión abierta',
                "rememberme": 'Recordarme',
                "forgotpassword": '¿Se te olvidó tu contraseña?',
                "language": 'LENGUAJE',
                "module": 'MODULO',
                "role": 'ROL',
                "loginTextUnlock": 'Desbloquear',
                "loginTextCheck": 'Verificar',
                "loginTextLogin": 'Ingresar',
                "signAnother": 'Ingresar con otra cuenta'
            },
            'formula': {
                'valid': 'Fórmula válida',
                'invalid': 'Fórmula inválido',
                'validate': 'validar'
            },
            'filterbar': {
                'isEqualTo': 'Es igual a',
                'isNotEqualTo': 'No es igual a',
                'greatThanOrEqual': 'Mayor o igual a',
                'lessThanOrEqual': 'Menor o igual a',
                'greatThan': 'Mayor a',
                'lessThan': 'Menor a'
            },
            'mainGrid': {
                'maskText': {
                    'getConfig': 'Verificando configuración en grid...',
                    'startUp': 'Empezando'
                },
                'menuText': {
                    'fileText': 'Archivo',
                    'recordText': 'Registro',
                    'historicalText': 'Histórico',
                    'addRecord': 'Agregar un nuevo registro',
                    'editRecord': 'Editar registro seleccionado',
                    'viewRecord': 'Ver registro seleccionado',
                    'removeRecord': 'Eliminar registro seleccionado',
                    'formatText': 'Formato',
                    'relatedProgram': 'Programas relacionados'

                },
                'options': {
                    'generalHistory': 'Histórico General',
                    'recordHistory': 'Histórico de registro',
                    'markColor': {
                        'text': 'Marcado con el color',
                        'nocolor': 'No Color',
                        'red': 'Rojo',
                        'blue': 'Azul',
                        'green': 'Verde',
                        'yellow': 'Amarillo'
                    },
                    'markFlag': 'Marcado con la bandera',
                    'filterByValue': 'Filtrar por valor',
                    'orderColumnAsc': 'Ordenar por orden creaciente',
                    'orderColumnDesc': 'Ordenar por orden decreciente',
                    'lockColumn': 'Congelar',
                    'unLockColumn': 'Descongelar',
                    'groupBy': 'Agrupar por este campo',
                    'comment': 'Agregar comentario',
                    'showGroup': 'Mostrar grupos'
                },
                'msg': {
                    'errorNoRow': '<div><b>Error de selección</b></div> <div> Debes que selecionar al menos una fila...</div>',
                    'errorRelatedPrograms': '<div><b>Selection Error</b></div> <div> Debes seleccionar una sola fila para usar los programas relacionados</div>',
                    'errorLoad': '<div><b>Error de carga</b></div><div><b>Nombre: </b>',
                    'lostInformation': '',
                    'noRecord': 'Ningún registro seleccionado'
                },
                'msgText': {
                    'deleteDesign': '¿Está seguro de que desea eliminar el diseño actual? Esta acción no puede ser revertida',
                    'deletingDesign': 'Eliminando diseño...',
                    'noDesignSelected': 'Por favor, seleccione un diseño prmero y luego haga clic en este botón',
                    'designNotDeleted': 'El diseño actual no se puede eliminar, por favor intente de nuevo',
                    'designNotDeletedBy': 'El diseño actual no se puede eliminar, debido:  ',
                    'deletingItem': function (name, type) {
                        return "Está seguro que desea eliminar el '" + name + "' " + type + ', Esta acción ni puede ser revertida';
                    }
                },
                'type': {
                    'connection': 'conexión'
                }
            },
            'attachment': {
                'mask': {
                    'getVersions': 'Obteniendo versiones de acrichos adjuntos...',
                    'update': 'Actualizando estado de archivo adjunto...',
                    'save': 'Guardando archivo adjunto...',
                    'getTimeline': 'Cargando el historico del archivo adjunto',
                    'getComment': 'Cargando data del comentario',
                    'getAttachment': 'Cargando data del archivo adjunto...',
                    'commentList': 'Verificando si el registro tiene comentarios...',
                    'attachmentList': 'Verificando si el registro tiene archivos adjuntos...',
                    'validate': 'Validando...'
                },
                'button': {
                    'newVersion': 'Crear nueva versión',
                    'approve': 'Aprovar',
                    'decline': 'Declinar',
                    'showVersion': 'Ver versiones',
                    'pending': 'Pendiente',
                    'complete': 'Completar',
                    'tooltip': {
                        'close': 'Cerrar panel de comentario',
                        'pin': 'Mantener visible',
                        'unpin:': 'Ocultar panel'
                    }
                },
                'message': {
                    'privileges': '<p>Usted no tiene privilegios para realizar esta acción sobre este registro</p>',
                    'timelineCreate': 'Registro de línea de tiempo creado con exito',
                    'timelineErrorSave': 'Registro de línea de tiempo no se pudo guardar por: ',
                    'thruDateError': 'la fecha debe ser mayor a la fecha desde',
                    'successStateChange': 'Successfully changed the state of the file to ',
                    'failStateChange': 'No se pudo actualizar el comentario por : ',
                    'successAttach': 'Archivo adjuntado exitosamente',
                    'failAttach': 'El archivo no se pudo adjuntar por: ',
                    'successVersionAttach': 'Versión del ajunto creada existosamente',
                    'failVersionAttach': 'La versión del adjunto no se pudo crear por: ',
                    'validationForm': 'Tiene que ingresar los campos requeridos',
                    'failFileType': 'El archivo no se pudo ser subido, ya que es un tipo de archivo no permitido',
                    'failFileSize': 'El tamaño del archivo es mas grande que '

                }
            },
            'comment': {
                'newEmptyText': 'Escriba el comentario aqui...',
                'contextual': {
                    'remove': 'Eliminar el comentario'
                },
                'maskText': {
                    'save': 'Guardando el comentario...',
                    'remove': 'Eliminando el comentario...',
                    'update': 'Actualizando el comentario...',
                    'successUpdate': 'Comentario actualizado',
                    'failUpdate': 'El comentario no se pudo actualizar por: '
                },
                'button': {
                    'tooltipText': {
                        'save': 'Guardar comentario',
                        'close': 'Cerrar el panel de comentario',
                        'pin': 'Mantener visible',
                        'unpin': 'Ocultar el panel',
                        'scopeValue': {
                            'privateText': 'Comentario privado',
                            'publicText': 'Comentario público'
                        }
                    }
                }
            },
            'dataStreamer': {
                'dynamicToolbar': {
                    'viewMenu': 'VER',
                    'compactMode': 'Modo compacto',
                    'standardMode': 'Modo éstandar',
                    'analyticMode': 'Modo analítico',
                    'modernMode': 'Modo moderno',
                    'goMenu': 'GO',
                    'nextPage': 'Página siguiente',
                    'previousPage': 'Página previa',
                    'firstPage': 'Primera página',
                    'lastPage': 'Ultima página',
                    'refreshPage': 'Actualizar página'
                }
            },
            'displayFormat': {
                'connectionPanelTitle': '<h3>Configuración de conexiones y eventos</h3>',
                'eventPanelTitle': 'Eventos',
                'selectedEventsTitle': 'Eventos seleccionados',
                'label': {
                    'connectionStreamerCombo': 'Seleccione el WCF del visor',
                    'connectionCombo': 'Selecione el WCF de conexión',
                    'cancelButton': 'Cancelar',
                    'nextButton': 'Siguiente',
                    'backButton': 'Regresar',
                    'saveButton': 'Guardar',
                    'globalConfigurations': 'Configuraciones generales',
                    'propertyGridGroupHeader': 'Sección',
                    'deployFormatName': 'Nombre',
                    'deployFormatDescription': 'Descripción',
                    'amountSaved': 'Salvada',
                    'amountLost': 'Perdido',
                    'amountRecovered': 'Recuperado',
                    'startTime': 'Hora inicio',
                    'endTime': 'Hora final',
                    'rateTime': 'Cada',
                    'rowIdentifier': 'Identificador de columna',
                    'mainScore': 'Score principal',
                    'keyComment': 'Llave de comentarios',
                    'availableBalance': 'Saldo disponible',
                    'transactionAmount': 'Monto de transacción',
                    'columnDataIndex': 'Columna',
                    'operatorCondition': 'Operador',
                    'valueCondition': 'Valor',
                    'group': {
                        'condition': 'Condición (pasos a seguir)',
                        'fields': 'Campos (data index)',
                        'refresh': 'Actualización',
                        'amount': 'Cantidad',
                        'general': 'General'
                    }
                }
            },
            'simpleStyleConfig': {
                'fieldLabel': {
                    'width': 'Ancho',
                    'height': 'Alto',
                    'borderTitle': 'Margen',
                    'borderSize': 'Tamaño del margen',
                    'borderStyle': 'Estilo del margen',
                    'borderStyleValue': {
                        'solidText': 'Solido',
                        'dashedText': 'Discontinua',
                        'dottedText': 'Punteado',
                        'doubleText': 'Doble'
                    }
                }
            },
            'translationDialog': {
                'title': 'Centro de traducción',
                'comboLanguage': 'Idioma de referencia',
                'grid': {
                    'column': {
                        'referenceName': 'Nombre de etiqueta',
                        'translation': 'Traducir a  ',
                        'reference': 'Traducir en ',
                        'laguage': 'Idioma',
                        'status': 'Estadp',
                        'flag': 'Icono',
                        'edit': 'Editar'
                    },

                    'groupHeaderText': {
                        'type': 'Tipo',
                        'option': {
                            'menu': 'Menú',
                            'design': 'Diseño'
                        }
                    },
                    'panel': {
                        'status': 'Estado de traducción',
                        'label': 'Etiquetas de traducción'
                    }

                },
                'panel': {
                    'setting': 'Configuración de traducción'
                },
                'tree': {
                    'title': 'Menú en'
                },
                'button': {
                    'save': 'Guardar traducciones',
                    'close': 'Cerrar',
                    'back': 'Atrás'
                },
                'message': {
                    'closeConfirm': '¿Esta seguro de que desa salir sin guardar?',
                    'saved': 'Traducción guardada exitosamente',
                    'comboChange': '¿Está seguro de que desea cambiar el valor? todos los cambios no guardados se perderán',
                    'errorConnection': 'La conexión con el servidor se ha perdido, por favor, inténtelo de nuevo en unos minutos'
                }
            },
            'publishDialog': {
                'title': {
                    'window': 'Publicar diseño'
                },
                'fieldLabel': {
                    'nameField': 'Nombre',
                    'descriptionField': 'Desccripcción',
                    'templateField': 'Plantilla predeterminada',
                    'secureConnection': 'Conexión para publicar',
                    'askForParametersField': 'Siempre pida los parametros al inicio'
                },
                'emptyText': {
                    'nameField': 'Escriba el nombre que se muestra en el opción del menú',
                    'secureConnection': '    una conexion a publicar',
                    'descriptionField': 'Escriba un adescripcción del diseño publicado'
                },
                'msgText': {
                    'publishing': 'Publicando diseño',
                    'labelExist': 'La etiqueta ya existe, favor de cambiarla',
                    'noNodeSelect': 'Debe seleccionar un nodo para añadir',
                    'notAddMenu': 'No se puede aregar una ruta de menú para un artículo',
                    'doNotRemove': 'no se puede quitar este menú porque tiene elementos',
                    'menuModeRead': 'Este menu es solo de lectura',
                    'saveOk': 'Se ha publicado con exito el diseño',
                    'tryAgain': 'La conexion con el servidor se ha perdido, por favor, intentelo de nuevo en unos minutos'
                },
                'tooltip': {
                    'addFolder': 'Agregar folder hijo',
                    'removeItem': 'Quitar elemento actual',
                    'publishHere': 'Publicar en ubicación'
                },
                'buttons': {
                    'publish': 'Publicar',
                    'cancel': 'Cancelar',
                    'delete': 'Remover',
                    'ok': 'Aceptar'
                },

                'window': {
                    'title': 'Etiqueta'
                },
                'tree': {
                    'nodeRoot': 'Estructura del menú',
                    'contextualMenu': {
                        'publishHere': 'Publicar aquí el menú',
                        'addNewMenuGroup': 'Agregar un nuevo menú',
                        'removeMenu': 'Remover el elemento actual',
                        'editLabel': 'Editar etiqueta'
                    },
                    'chekboxModeGen': 'Crear etiqueta genérica para el menú',
                    'editor': {
                        'title': 'Nuevo elemento del menú',
                        'labelName': 'Nombre de etiqueta',
                        'save': 'Guardar',
                        'cancel': 'Cancelar',
                        'validate': 'Validar'
                    },
                    'expandAll': 'Expandir todos',
                    'collapseAll': 'Collapsar todos'
                }

            },
            'schedule': {
                'addSchedule': 'Agregar horario',
                'from': 'Desde',
                'to': 'Hasta:',
                'allDay': 'Todo el día',
                'addEvent': 'Agregar',
                'editEvent': 'Editar',
                'availableHours': 'Horas disponibles',
                'needSchedule': 'Se necesita tener por lo menos un día configurado en el horario'
            },
            'dayWeek': {
                'sunday': 'Domingo',
                'monday': 'Lunes',
                'tuesday': 'Martes',
                'wednesday': 'Miércoles',
                'thursday': 'Jueves',
                'friday': 'Viernes',
                'saturday': 'Sábado'
            },
            'field': {
                'msgText': {
                    'multipleRow': "Este campo de texto está mostrando <b style='color:red;'>SOLO</b> la primera fila en la fuente de datos, para ver el resto de filas por favor crea una cuadrícula de datos"
                }
            },
            'bigMenu': {
                'buttonText': {
                    'help': 'Ayuda',
                    'settings': 'Configuraciones',
                    'taskManager': 'Administrador de tareas',
                    'logOut': 'Cerrar sesión',
                    'lock': 'Bloquear',
                    'appTree': 'Menú de arbol',
                    'appRecent': 'Menú; de recientes',
                    'appFavorite': 'Menú de favoritos',
                    'style': 'Seleccionar estilo de menú'
                },
                'currentMenuViewFavorite': 'Vista de menús favoritos',
                'currentMenuViewAll': 'Vista de todos los menús'
            },
            'jsonPanel': {
                'instanceMode': {
                    'viewText': 'Modo de ver',
                    'newText': 'Crear nuevo',
                    'updateText': 'Modo de actualización',
                    'deleteText': 'Modo de eliminar'
                },
                'buttons': {
                    'updateText': 'Actualizar',
                    'newText': 'Guardar nuevo',
                    'saveOtherText': 'Guardar otro',
                    'cancelText': 'Cancelar',
                    'fileText': 'Archivo',
                    'recordText': 'Registro'
                },
                'msgText': {
                    'saveSuccess': 'Registro guardado exitósamente',
                    'updateSuccess': 'Registro actualizado exitósamente',
                    'removeSuccess': 'Registro borrado exitósamente',
                    'errorSuccess': 'A ocurrido un error en la transacción.  Contacte a su administrador para mas información.',
                    'updating': 'Actualizando, por favor espere...',
                    'tryAgain': 'Por favor, intente de nuevo',
                    'formInvalid': 'Hay algunos errores en el formulario, coloque el puntero sobre los campos en rojo, para ver el detalle del error',
                    'formHasChanges': 'Hay algunos cambios en el formulario, ¿Está seguro de cancelar los cambios?',
                    'removeRecord': 'Esta seguro de eliminar el record actual?  Esta acción no puede revertirse?',
                    'informationMissing': 'Debe completar los campos requeridos.',
                    'cancel': 'Cancelar cambios'
                },
                'loadMaskMessage': {
                    'reading': "Cargando...",
                    "waiting": 'Espere...',
                    "removing": "Eliminando...",
                    "updating": "Modificando...",
                    "saving": "Guardando..."
                }
            },
            'universalField': {
                'combobox': {
                    'clearMessage': 'Al limpiar este valor se borraran todos los valores asociados. ¿Desea continuar?',
                    'clearTitle': 'Cuidado',
                    'previewMode': 'Necesita estar en modo de ejecuccion para porder ver registros. '
                }
            },
            'loadDesign': {
                'loadText': {
                    'initializing': 'Inicializando...',
                    'loadingWindowTitle': 'Por favor espere',
                    'gettingDesign': 'Obteniendo diseño...',
                    'gettingReady': 'Comenzando las operaciones...',
                    'loadingDesign': 'Cargando diseño...',
                    'loadingConnections': 'Cargando conexiones...',
                    'loadingParameters': 'Cargando parametros...',
                    'loadingDataSources': 'Cargando las fuentes de datos...',
                    'chargingDesignData': 'Cargando data del diseño...',
                    'openingConnections': 'Abriendo conexiones...',
                    'settingParameters': 'Configurar parametros...',
                    'rollingBack': 'Revirtiendo...'
                },
                'msgText': {
                    'loadedDesignNoLongerExists': 'Parece que el diseño que intenta cargar ya no existe, por favor verifique e inténtelo de nuevo'
                }
            },
            'criteriaPanel': {
                'msgText': {
                    'selectFieldValueFirst': 'Debe seleccionar primero el valor del campo',
                    'selectRowToDeleteFirst': 'Por favor, primero selecciona una fila para eliminar'
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
                'defaultTitle': '<b>Los siguientes errores impiden continuar el proceso</b>',
                'errorGroup': {
                    'defaultGroup': 'Predeterminado'
                },
                'msgText': {
                    'noDataToDisplay': 'No hay datos para mostrar'
                }
            },
            'parameterSetupDialog': {
                'title': {
                    'parameters': 'Parametros'
                },
                'advancedSearchTooltip': 'Mostrar dialogo de búsqueda avanzada',
                'advancedSearchFieldsTitle': 'Campos de búsqueda',
                'buttonText': {
                    'search': 'Búsqueda',
                    '_continue': 'Continuar',
                    'cancel': 'Cancelar',
                    'clear': 'Limpiar búsqueda'
                },
                'buttons': {
                    '_continue': 'Continuar',
                    'searchIt': 'Buscarlo...',
                    'cancel': 'Cancelar'
                },
                'msgText': {
                    'noCriteria': 'You must insert at least one search criteria in the gird.',
                    'noRecordSelected': 'You must select a row from the result grid.',
                    'allFieldsRequired': 'All fields are required',
                    'selectRecord': "Seleccione un registro"
                }
            },
            'gridPanel': {
                'buttons': {
                    'downloadXLS': 'Download as .XLS'
                },
                'msgText': {
                    'noSourceMessage': 'There is a problem on connecting to the current data Store, please verify the settings and try again',
                    'noDataInEditMode': 'Data wont display in edit mode, press the preview button to see the current data.',
                    'noDataToDisplay': 'No data to display.'
                }
            },
            'searchPanel': {
                'label': {
                    'showMore': 'Mostrar mas'
                },
                'staticGroupName': {
                    'mathResult': 'Resultado de la operación matemática'
                }
            },
            'timeLine': {
                'button': {
                    'dayMode': 'Día',
                    'weekMode': 'Semana',
                    'monthMode': 'Mes'
                },
                'parameterWindow': {
                    'title': 'Parametros para crear la línea de tiempo',
                    'selectedMenuPanel': 'Menús seleccionados',
                    'menuList': 'Lista de menús',
                    'form': {
                        'label': {
                            'position': 'Pocisión de la línea de tiempo',
                            'from': 'Desde',
                            'thru': 'Hasta',
                            'valuePicker': 'Obtener la ultima'
                        }
                    },
                    'button': {
                        'ok': 'Listo',
                        'cancel': 'Cancelar',
                        'selectAll': 'Seleccionar todos los menús',
                        'removeAll': 'Quitar todos los menús'
                    },
                    'valueLabel': 'Dias',
                    'removeText': 'Quitar',
                    'messageBoxMsg': 'Obtiendo los datos del histórico...',
                    'messageBoxProgressText': 'Enviando...',
                    'waitMessage': 'Cargando datos...',
                    'timelineTabTitle': 'Línea de tiempo, multi vista',
                    'noResultsPanel': '<h4>Tu búsqueda no obtubo resultados</h4><h5>Favor redefina los parámetros de búsqueda</h5>',
                    'waitWindowMsg': 'Obtienendo información del histórico, favor de esperar...',
                    'waitWindowProgressText': 'Enviando...',
                    'waitWindowText': 'Cargando información...'
                },
                'multiViewPanel': {
                    'timelineGrid': {
                        'emptyText': 'No registros para mostrar',
                        'messageBox': {
                            'msgText': 'Generando la vista de línea de tiempo, por favor, espere...',
                            'progressText': 'Enviando...',
                            'waitMessage': 'Dibujando datos...'
                        },
                        'columnText': {
                            'action': 'Acción',
                            'comment': 'Comentario',
                            'menuDescription': 'Descripción del menú',
                            'menuName': 'Nombre del menú',
                            'recordDescription': 'Descripción del registro',
                            'recordName': 'Nombre del registro',
                            'username': 'Nombre de usuario',
                            'date': 'Fecha',
                            'module': 'Modulo',
                            'role': 'Rol',
                            'data': 'Dato'
                        }
                    },
                    'timeline': {
                        'filteredTitle': 'La data está filtrada por el siguiente criterio: ',
                        'timelineViewTooltip': 'Cambiar a vista de línea de tiempo',
                        'gridViewTooltip': 'Cambiar a vista cuadrícula',
                        'normalUserTitle': 'Información del registro',
                        'advancedPanelTitle': 'Captura del registro',
                        'originalPanelTitle': 'Registro original',
                        'updatedPanelTile': 'Registro actualizado',
                        'comparePanelText': 'Campos modificados',
                        'compareButtonTooltip': 'Comparar cambios',
                        'snapshotButtonTooltip': 'Vista de captura',
                        'advancedButtonTooltip': 'Vista avanzada',
                        'normalViewTooltip': 'Vista normal'

                    }
                },
                'timelinePanel': {
                    'userComboEmptyText': 'Seleccionar un usuario',
                    'roleLabel': 'Rol',
                    'roleComboEmptyText': 'Seleccionar un rol',
                    'timezoneLabel': 'Zona horaria',
                    'timezoneComboEmptyText': 'Seleccionar una zona horaria',
                    'actionLabel': 'Acción',
                    'actionComboEmptyText': 'Seleccionar un aacción',
                    'commentLabel': 'Commentario',
                    'commentComboEmptyText': 'Escribir comentario',
                    'additionalFilterPanelTitle': 'Filtrar por',
                    'searchButtonText': 'Buscar',
                    'titleText': 'Detalle de',
                    'maskText': 'Generar vista de línea de tiempo',
                    'detailPanel': {
                        'commentText': 'Commentario',
                        'dateText': 'Fecha',
                        'fromText': 'Desde',
                        'thruText': 'Hasta',
                        'nameText': 'Nombre',
                        'descriptionText': 'Descripción',
                        'actionText': 'Acción',
                        'userText': 'Usuario',
                        'typeText': 'Tipo',
                        'propertyGridTitle': 'Detalle del elemento de la línea de tiempo'
                    }
                }
            },
            'mainMenu': {
                'itemLabel': {
                    'favorites': 'Favoritos',
                    'widgets': 'Widgets',
                    'administrativeTools': 'Herramientas de administrador',
                    'translationCenter': 'Centro de traducción',
                    'recents': 'Recientes',
                    'more': 'Mostrar mas',
                    'showLog': 'Mostrar registro',
                    'parentRelationship': 'Relación padres e hijos',
                    'displayFormat': 'Formato de despliegue'
                },
                'contextMenu': {
                    'openItem': 'Abrir este menu en una nueva pestaña',
                    'addToFavorites': 'Agregar este menú a favoritos'
                }
            },
            'container': {
                'menuLabel': {
                    'openTab': 'Ir a esta pesataña',
                    'addToFavorites': 'Agregar esta pestaña a favoritos',
                    'closeTab': 'Cerrar esta pestaña'
                },
                'translationcenter': 'Centro de traducción',
                'generalhistorical': 'Histórico general',
                'setting': 'Opciones',
                'lock': 'Bloquear',
                'logout': 'Salir',
                'search': 'Buscar',
                'title': {
                    'accessLog': 'Registro de acceso'
                },
                'tooltips': {
                    'hideSidebarPanel': 'Ocultar este panel'
                },
                'contextMenu': {
                    'move2left': 'Mover a la ezquierda',
                    'move2right': 'Mover a la derecha',
                    'restore': 'Restaurar',
                    'go2multiView': 'Ir a la vista multiple'
                }
            },
            'login': {
                'loginBoss': {
                    'noBosses': 'Usted no tiene jefes asignados. La bandera para loginBoss está activada. Actualice los permisos del grupo.',
                    'noBossAssigned': 'No tienes ningún jefe asignado. Ve a los usuarios del grupo y actualiza los permisos del grupo.'
                }
            },
            'notifications': {
                'toolbar': {
                    'notifications': '<b>Notificaciones</b>',
                    'today': '<b>Hoy</b>',
                    'markAllRead': 'Marcar todas como leidas',
                    'addNew': 'Agregar nuevo'
                },
                'dateText': function (todayDate) {
                    // return Ext.Date.format(todayDate, "l, F jS ");
                    return Ext.Date.format(todayDate, 'l, d/F/Y');
                },
                'title': {
                    'reminders': 'Recordatorios',
                    'calendar': 'Calendario',
                    'tomorrow': 'Mañana',
                    'news': 'Noticias'
                }
            },
            'apiLicenseText': '/!* Monitor Plus Architect - Creado por MonitorPlus *!/',
            'apiVersion': '1.5',
            'apiName': 'Monitor Plus Architect',
            'apiFooter': 'Copyright (C) 2000-2012, Plus Holding International Limited. Todos los derechos reservados',
            'msgText': {
                'all': 'TODOS',
                'somethingWrong': 'Algo sucedión, favor intente de nuevo',
                'invalidForm': 'Uno o mas campos requeridos en el formulario no se ingresaron, revise la información y vualva a intentartlo',
                'errorHeader': 'Error',
                'warningHeader': 'Advertencia'
            },
            'buttons': {
                '_add': 'Agregar',
                'remove': 'Quitar',
                'cancel': 'Cancelar',
                '_ok': 'Aceptar',
                '_back': 'Atras',
                'save': 'Guardar'
            },
            'floatingActions': {
                'confirm': 'Confirmar',
                'saverecord': 'Guardar registro',
                'updaterecord': 'Actualizar registro',
                'deleteRecord': 'Eliminar registro',
                'saveanother': 'Guardar otro'
            },
            'menu': {
                'favorites': {
                    'msg': {
                        'add': 'Exitosamente agregado a favoritos',
                        'fail': 'No pudo ser agregado a favoritos por: ',
                        'remove': 'Exitosamente eliminado de favoritos',
                        'failRemove': 'No se pudo eliminar de favoritos por: '
                    },
                    contextual: {
                        'add': 'Agregar a favoritos',
                        'remove': 'Eliminar de favoritos'
                    }
                },
                'favoriteMenuText': 'Menú favoritos',
                'recentMenuText': 'Menú recientes',
                'regularMenuText': 'Menú normal',
                'treeMenuText': 'Menú arbol',
                'allMenuTooltip': 'Mostrar todos los menús',
                'showFavoriteMenu': 'Mostrar los menús favoritos',
                'showFavoriteView': 'Mostrar vista de menús favoritos',
                'showTreeView': 'Mostrar vista de menú de arbol',
                'widgets': 'Widgets',
                'recents': 'Recientes',
                'menu': 'Menú',
                'edit': 'Editar',
                'remove': 'Remover',
                'clone': 'Clonar',
                'list': 'Lista',
                'more': 'Mostar mas...',
                'showLog': 'Mostrar registro',
                'user': 'Usuario',
                'logout': 'Cerrar sesión',
                'help': 'Ayuda',
                'aboutus': 'Acerca Monitor 5',
                'password': 'Contraseña',
                'sessionExpires': function (time) {
                    return '<div>Sesión expira </div><div>en ' + (Ext.containerSettings.timeAfterLock - time) + ' segundos</div>';
                },
                'unlock': '<span style ="color: white; top: 2px; position: relative;" > Desbloquear</span>'
            },
            'crud': {
                'category': 'Categoría',
                'name': 'Nombre',
                'description': 'Descripción',
                'domain': 'Dominio',
                'code': 'Código',
                'detail': 'Detalle',
                'tlength': 'Longitud'
            },
            'confidenceLevel': {
                'type': 'Tipo',
                'list': 'Lista',
                'levelCreated': 'Nivel creado correctamente',
                'failedToCreateLevel': 'No se ha podido crear el nivel',
                'sizeNodesExceeded': 'Se ha superado el tamaño de los nodos',
                // confidence level dialog.
                'selectLevel': 'Debe seleccionar un nivel de confianza',
                'loadingLevels': 'Cargando niveles de confianza...',
                'titlePanel': 'Nivel de confianza',
                'commentField': 'Comentario',
                'treeEmptyText': 'Ninguno nivel de confianza'
            },
            'generic': {
                'yes': 'Si',
                'else': 'Entonces',
                'save': 'Guardar',
                'attachment': 'Adjunto',
                'comment': 'Comentario',
                'false': 'Falso',
                'true': 'Verdadero',
                'landing': 'Cargando...',
                'updating': 'Actualizando...',
                'saving': 'Guardando...',
                'deleting': 'Borrando...',
                'successsave': 'Guardado exitoso',
                'updated': 'Actualizado',
                'deleted': 'Borrado'
            },
            'panelMore': {
                'importText': 'Imporat',
                'manageText': 'Administrar',
                'searchText': 'Buscar'
            },
            'containerController': {
                'logOutMaskText': 'Cerrando sesión...',
                'notificationMessage': '<div><b>Información de autentificación</b></div><div>Se ha delogueado del sistema...</div><div>Por motivos de seguridad se reiniciará el sistema</div>',
                'errorMessage': '<div><b>Información de autenticación</b></div>'
            },
            'settings': {
                'title': 'Opciones',
                'loader': 'Cargando... configuraciones',
                'loadersaving': 'Guardando... configuraciones',
                'successSave': 'Guardado exitoso',
                'categories': {
                    'Settings': 'Opciones',
                    'user': 'Usuario',
                    'menu': 'Menú',
                    'historical': 'Histórico'
                },
                'sections': {
                    'User': 'Usuario',
                    'Theme': 'Tema',
                    'General': 'Generales'
                },
                'fields': {
                    'label': {
                        'maxTabs': 'Máximo de tab abiertas simultaneamente',
                        'homeMenuStyle': 'Estilo del menú de inicio',
                        'maxRecent': 'Máximo de recientes',
                        'maxFavs': 'Máximo de favoritos',
                        'timeBeforeLock': 'Tiempo antes de bloquear la aplicación',
                        'alivePinTick': 'Momentos antes de madar el pin de vida (cada momento son 5s)',
                        'remainderTime': 'Segundos antes de terminar la sesión cuando esta bloqueado',
                        'themeColor': 'Color del tema',
                        'themeListButton': 'Boton',
                        'themeListProgress': 'Progreso',
                        'themeListPanel': 'Panel',
                        'themeListWindow': 'Ventana',
                        'themeListTab': 'Pestaña',
                        'containerSettingsPanel': "<b style='font-size:25px; line-height: 30px;'><i>Opciones del container</i></b>",
                        'menuPanel': "<b style='font-size:25px; line-height: 30px;'><i>Opciones del menú</i></b>",
                        'themePanel': "<b style='font-size:25px; line-height: 30px;'><i>Opciones del tema</i></b>",
                        'generalPanel': "<b style='font-size:25px; line-height: 30px;'><i>Opciones generales</i></b>",
                        'marqueeName': 'Nombre',
                        'marqueeDescription': 'Descripción',
                        'marqueeValue': 'Texto',
                        'marqueeSplitter': 'Separador',
                        'marqueeOptionsPanel': 'Opciones de marquesina',
                        'marqueeAddButtonTooltip': 'Agregar nuevo registro',
                        'marqueeRecordsPanel': 'Registros existentes de marquesina',
                        'marqueeIndex': 'Indice',
                        'marqueeEmptyText': '<h1><b>Selecione una cateoría</b></h1>',
                        'deleteMarqueeRecord': 'Eliminar registro'
                    }
                }

            },
            'viewerAlert': {
                'displayFieldLastUpdated': '<b>Ultima actualizacion</b>',
                'tagFieldFilterApplied': '<b>Filtros aplicados</b>',
                'displayFieldQueue': '<b>Cola</b>',
                'displayFieldGroupBy': '<b>Agrupado por</b>',
                'dateFieldDate': 'Fecha',
                'timeFieldTime': 'Hora',
                'comboResultType': 'Tipo de resultado',
                'comboActionTaken': 'Accion tomada',
                'comboPendingType': 'Tipo de pendiente',
                'textAreaResult': 'Resultado de la investigacion',
                'qualifyButton': 'Calificar como ',
                'contextMenu': {
                    'view': 'Ver',
                    'userData': 'Ver data de usuario',
                    'transactionDetail': 'Ver detalle de transaccion',
                    'profile': 'Ver perfil',
                    'transfer': 'Transferir a destinatario',
                    'perform': 'Ejecutar rutina',
                    'transactionDetailRange': 'Ver detalle de transaccion por rango',
                    'pending': 'Pendiente',
                    'qualifiy': 'Calificar altertas',
                    'requalify': 'Recalificar alertas',
                    'historical': 'Ver el historial de la calificacion'
                },
                'menu': {
                    'dataCategories': 'Filtro de categorias de data',
                    'all': 'Todo',
                    'pending': 'Pendiente',
                    'toMe': 'Asignadas a mi',
                    'toMyRole': 'Asignadas a mi rol',
                    'unseen': 'Alertas no vistas',
                    'viewed': 'Alertas vistas',
                    'notQualified': 'Alertas no calificadas',
                    'qualified': 'Alertas calificadas',
                    'groupBy': 'Agrupar por esta columna'
                },
                'ok': 'Listo',
                'reset': 'Limpiar',
                'cancel': 'Cancelar',
                'queue': 'Cola: ',
                'operator': 'tiene',
                'operators': {
                    'eq': 'es igual a',
                    'ne': 'distinto que',
                    'gte': 'mayor o igual',
                    'lte': 'menor o igual',
                    'gt': 'mayor que',
                    'lt': 'menor que ',
                    'like': 'tiene'
                },
                'operatorDescription': 'es en la cola ',
                'user': 'Usuario ',
                'searchIn': 'Buscar en ',
                'active': 'Activo',
                'description': 'Descripcion',
                'elapsed': 'Tiempo transcurrido',
                displaying: 'Mostrando',
                records: 'registros',
                'title': {
                    'detail': 'Detalle de ',
                    'chart': 'Panel de graficas',
                    'from': 'Desde',
                    'to': 'Hasta',
                    'qualified': 'Calificado como ',
                    'dataFiltered': 'Data filtrada por',
                    'activeAlerts': 'Alertas activas',
                    'transactionDetail': 'Detalle de transaccion de '
                },
                'configuration': {
                    'structure': 'Estructura de visor de alertas',
                    'events': 'Seleccion de eventos',
                    'title': 'Ventana de configuracion del visor de alertas'
                },
                'mask': {
                    'gettingEvents': 'Obteniendo eventos para estructura de visor de alertas  ',
                    'struct': 'Obteniendo estructura de visor de alertas...',
                    'transactionDetail': 'Obteniendo el detalle de la transaccion...',
                    'groupedData': 'Obteniendo data agrupada...',
                    'qualifying': 'Calificando la alerta como ',
                    'config': 'Configurando el visor ...',
                    qualificationHistory: 'Obteniendo el historial de la calificacion...'
                },
                columns: {
                    alertCondition: 'Condiciones de alerta'
                },
                tooltip: {
                    compact: 'Vista compacta',
                    comfortable: 'Vista relajada',
                    close: 'Cerrar el visor de alertas',
                    excel: 'Exportar a excel',
                    dontHave: 'no esta',
                    have: 'esta',
                    changeRegular: 'Cambiar a vista normal',
                    changeGrouped: 'Cambiar a vista agrupada',
                    alertQueue: 'Cola de alerta'
                },
                msg: {
                    alertOf: ' alerta de ',
                    loadError: '<b>Error de carga:</b> ',
                    blockedAlert: 'No puede trabajar en esta alerta por que <b>esta bloqueada</b>',
                    locked: 'Bloqueada',
                    unlocked: 'Desbloqueada'
                }
            },
            'expressionCriteria': {
                'columns': {
                    'connector': 'Conector',
                    'field': 'Campo',
                    'operator': 'Operador',
                    'value': 'Valor'
                },
                'buttons': {
                    'addRow': 'Agregar fila',
                    'removeRow': 'Remover fila',
                    'removeParenthesis': 'Remover paréntesis',
                    'addParenthesis': 'Agregar paréntesis',
                    'narrative': 'Mostrar narrativa',
                    'comment': 'Comentario',
                    'changeDescription': 'Cambiar descripción',
                    'shortDescription': 'Descripción corta',
                    'description': 'Descripción'
                },
                'tab': {
                    'property': 'Propiedades',
                    'reference': 'Referencias',
                    'search': 'Busqueda'
                },
                'msg': {
                    removeRow: '¿Está seguro de remover la fila?',
                    clearCriteria: '',
                    invalidGroup: '',
                    groupAlreadyExist: 'El grupo ya existe',
                    cannotIntersect: 'Los grupos no pueden cruzarse',
                    cannotGroup: 'No puede agrupar',
                    dragAndDrop: 'Arrastrar y soltar',
                    completeRow: 'Debe completar la fila: ',
                    invalidType: 'El tipo de dato no coincide'
                }
            },
            'dynamicTable': {
                'msgTitle': {
                    'warning': 'Advertencia!',
                    'confirm': 'Confirmar'
                },
                'errorMsg': {
                    'alterateDefinition': 'Hacer esta accion podra afectar la definicion de sus relaciones',
                    'atLeastOnePrimaryKey': 'Por lo menos debe de existir una llave primaria dentro de los campos',
                    'allFieldsRelated': 'Todos los campos deberian estar relacionados con un campo del evento',
                    'notTheSameRelation': 'No puede existir otra relacion con una misma definicion',
                    'dynamicTableAtLeastOneField': 'La tabla dinámica debe de contener al menós un campo',
                    'dynamicTableAtLeastOneRelation': 'La tabla dinámica debe de contener al menós una relación con un evento',
                    'dynamicTableZeroFields': 'Todas las relaciones deben de tener al menos un campo. Un campo debe de ser llave primaria',
                    'dynamicTableAllFieldsRelated': 'Todos los campos de la relación deberián estar relacionados. Actualice sus relaciones.'
                },
                'infoMsg': {
                    'deleteRelation': 'Seguro que desea borrar esta relacion?',
                    'saveSuccess': 'Registro guardado exitósamente',
                    'updateSuccess': 'Registro actualizado exitósamente',
                    'deleteSuccess': 'Registro eliminado exitósamente',
                    'desencryptSuccess': 'Desencriptación exitosa',
                    'updateFail': 'Error al actualizar',
                    'deleteFail': 'Error al borrar',
                    'saveFailed': 'Error al guardar',
                    'pleaseWait': 'Por favor espere...'
                }
            },
            'cardManager': {
                'buttons': {
                    'navigation': 'Navegación',
                    'actions': 'Acciones',
                    'next': 'Siguiente',
                    'previous': 'Anterior',
                    'save': 'Guardar'
                },
                'dashboard': 'Tablero',
                'menucard': 'Menú de tarjetas',
                'recent': 'Recientes',
                'windowCompare': {
                    'title': 'Comparar',
                    'chooseRegister': 'Escoger registro'
                },
                'confirmation': 'Confirmación',
                'sureToClose': 'Usted no ha guardado cambios. ¿Está seguro que desea salir?',
                'sureToMakeAction': '¿Está seguro en realizar esta acción?',
                'yes': 'Si'
            },
            'history': {
                'successSave': 'Histórico guardado exitosamente',
                'failSave': 'Hubo un error'
            },
            'generalTranslations': {
                'msg': {
                    'pleaseAddNode': 'Por favor ingrese nombre de nodo:',
                    'removeNode': 'Está seguro de eliminar el nodo?',
                    'onlyNumbersAndLetters': 'Únicamente números y letras estan permitidos en el nombre',
                    'pleaseAddLevel': 'Por favor ingrese nombre del nivel:',
                    'confirmation': 'Confirmar',
                    'confirmationUpdateRecord': 'Desea actualizar este registro?',
                    'confirmationDeleteRecord': 'Desea eliminar este registro?',
                    'relationshipSuccess': 'Relación creada correctamente',
                    'relationshipFail': 'Error al crear la relación incorrecta',
                    'notPermittedRelationship': 'Error al crear la relación incorrecta'
                }
            },
            structureViewerAlert: {
                toolbar: {
                    event: 'Propiedades de registro',
                    columns: 'Columnas',
                    sortAndGroup: 'Orden de agrupación y ordenamiento',
                    general: 'Propiedades generales',
                    qualification: 'Propiedades de calificación',
                    summary: 'Resumen',
                    previous: 'Previo',
                    next: 'Siguiente',
                    save: 'Guardar',
                    cancel: 'Cancelar'
                },
                name: 'Nombre',
                description: 'Descripción',
                wcf: 'Servicio web',
                method: 'Metodo',
                actionTaken: 'Acction tomada',
                resultType: 'Tipo de resultado',
                pendingType: 'Tipo de pendiente',
                editable: 'Editable',
                automaticCalculation: 'Calculo automatico',
                visible: 'Visible',
                eventIcon: 'Icono de registro',
                eventColor: 'Color de registro',
                searchField: 'Buscar un registro',
                eventField: 'Buscar campos de registro por codigo o descripcion de registro',
                alertField: 'Buscar campos de alerta por descripcion',
                scoreField: 'Buscar campos de score por codigo de registro o descripcion',
                selectColumn: 'Seleccionar una columna',
                groupColumn: 'Grupo',
                valuesColumn: 'Valores',
                textColumn: 'Texto',
                closeButton: 'Cerrar',
                saveButton: 'Guardar',
                deleteButton: 'Borrar',
                resetButton: 'Limpiar',
                addButton: 'Agregar',
                cancelButton: 'Cancelar',
                urgencyButton: 'Campo de urgencia',
                dateField: 'Campo de fecha',
                propertyName: 'Nombre',
                generalPropertiesGroup: 'Propiedades generales',
                headerColumnGroup: 'Columnas de encabezado',
                columns: 'Columnas',
                applyButton: 'Aplicar',
                styleButton: 'Estilo',
                configButton: 'Configuracion',
                removeButton: 'Remover',
                selectValue: 'Seleccionar un valor',
                okButton: 'Listo',
                descriptionText: 'Descripcion',
                descriptor: 'Descriptor',
                rowIdentifier: 'Identificador de la fila',
                mainScore: 'Score principal',
                availableBalance: 'Saldo disponible',
                transactionAmount: 'Monto de la transaccion',
                eventName: 'Registro',
                eventGroup: 'Registros',
                tooltip: {
                    removeRecord: 'Quitar el record de columna',
                    gridSettings: 'Configuracion de la grid'
                },
                mask: {
                    saved: 'Data guardada...',
                    eventValidation: 'Tienes que seleccionar el menos un registro',
                    selectedEvent: 'Tienes que selecionar al menos un registro seleccionado',
                    grupConfimationTitle: 'Quitar la columna agrupadora?',
                    groupConfirmationMessage: 'Tiene la columna ',
                    groupConfirmationMessageCont: 'configurada como agrupador, quiere quiatrlo?',
                    save: 'Guardando data de la estructura de visor...',
                    loadEvents: 'Cargando registros...',
                    fieldEvent: 'Obteniendo los campos de los registros...',
                    researchIndicators: 'Cargando indicadores de investigación...',
                    getMethods: 'Obteniendo metodos...'
                },
                title: {
                    qualificationProperties: ' propiedades de calificacion',
                    qualificationSection: 'Seccion de calificacion',
                    eventProperties: 'Configuracion de propiedades de registro',
                    columnStyle: 'Personalizacion de estilo de columna',
                    columnConfigurationFor: 'Configuracion de columna para ',
                    params: 'Parametros',
                    parametersForMethod: 'Parametros para el metodo ',
                    removeGroupColumn: '¿Quitar columna agrupadora?',
                    generalSection: 'Seccion general',
                    selectedEvents: 'Registros seleccionados',
                    eventField: 'Campos de registros',
                    alertField: 'Campos de alertas',
                    scoreField: 'Campos de score',
                    columnConfiguration: 'Configuracion de columna',
                    headerColumns: 'Columnas de encabezado',
                    detailColumns: 'Columnas de detalle',
                    headerAndSort: 'Orden de ordenamiento de encabezado',
                    detailSort: 'Orden de ordenamiento de detalle',
                    structureProperties: 'Propiedades de estructura de visor',
                    researchIndicatorSection: 'Seccion de indicadores de investigación',
                    fieldSection: 'Seccion de campos',
                    qualificationConfiguration: 'Configuracion de calificacion',
                    structureSummary: 'Resumen de estructura de visor'
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
