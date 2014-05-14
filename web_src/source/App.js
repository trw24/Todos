//
//	Troy's scaled down version of TodoMVC
//
//	Copyright 2014 by Troy Weidman
//
//	==================================================================================
//
//	MyCordovaListener.js
//

var myApp = {};


var MyCordovaListener = enyo.kind({
	components: [
	    {kind: "Signals", ondeviceready: "deviceReadyHandler"}
	],
	create: function() {

		this.inherited(arguments);
	},
	deviceReadyHandler: function() {

		myApp = new MyApp();
		myApp.renderInto(document.body);
	}

});

//
//
//	==================================================================================
//
//	Beginning of Object which gets created dynamically
//

enyo.kind({

	name: "oneActionItem",
	kind: "FittableRows",
	classes: "overall-width",
	style: "margin:auto;background:white;border-bottom: 1px dotted #ccc;",
	published: {
		userTodoString: "",
		parentsThis: "",
		deleteActionItemObject: {},
		userTodoCompletionStatusFlag: false
	},
	handlers: {
		// Disable Handlers since "hover" is not supported 
		// on a mobile devices (only works in PC/Mac browsers)
		// onmouseover: "onMouseOver",
		// onmouseout: "onMouseOut",
	},
	components:
	[{
		kind: "FittableColumns",
		style: "height:100%;",
		components:
		[
			{
				content: '✔',
				name: "userTodoCheckMark",
				ontap: "itemComplete",
				style: "font-size: 20px;padding-top: 11px;width:50px;height:inherit;background-color:inherit;text-align:center;"
			},
			{
				name: "userTodoString",
				content: "",
				fit: true,
				onchange: "userTodoStringChanged",
				classes: "task-format",
				style: "border:0px;border-left: 1px solid red;margin:0px;height:inherit;background-color:inherit;padding:10px;"
			},
			{
				content: '✖',
				name: "userTodoDeleteMark",
				ontap: "itemDeleteWithBind",		// Do "delete" with function passed in as object
				// ontap: "itemDelete",				// Do "delete" with "parentsThis"
				  style: "visibility:visible;font-size: 22px;padding-top: 11px;width:50px;height:inherit;background-color:inherit;text-align:center;"
			}
		]
	}],
	userTodoCompletionStatus: false,		// create var.  set initial value
	localDeleteActionItemVar: {},
	parentsThisVar: {},
	create: function() {

		this.inherited(arguments);
		this.userTodoCompletionStatusFlagChanged();
		this.userTodoStringChanged();
		this.parentsThisChanged();
		this.deleteActionItemObjectChanged();
	},
	userTodoCompletionStatusFlagChanged: function() {

		this.userTodoCompletionStatus = this.userTodoCompletionStatusFlag;
		this.$.userTodoString.addRemoveClass("task-now-complete", this.userTodoCompletionStatus);
		this.$.userTodoCheckMark.addRemoveClass("checkmark-now-complete", this.userTodoCompletionStatus);
		return true;
	},
	userTodoStringChanged: function() {

		this.$.userTodoString.setContent(this.userTodoString);
		return true;
	},
	parentsThisChanged: function() {

		this.parentsThisVar = this.parentsThis;
		return true;
	},
	deleteActionItemObjectChanged: function() {

		this.localDeleteActionItemVar = this.deleteActionItemObject;
		return true;
	},
	itemComplete: function(inSender, inEvent) {

		this.userTodoCompletionStatus = !this.userTodoCompletionStatus;		// toggle flag
		this.$.userTodoString.addRemoveClass("task-now-complete", this.userTodoCompletionStatus);
		this.$.userTodoCheckMark.addRemoveClass("checkmark-now-complete", this.userTodoCompletionStatus);
		this.parentsThisVar.saveToLocalStorage();		
		return true;
	},
	itemDelete: function(inSender, inEvent) {

		// This method is using context of parent (i.e. "parentsThis").
		this.parentsThisVar.removeItemFromList(this.getName());		
		return true;
	},
	itemDeleteWithBind: function(inSender, inEvent) {

		this.localDeleteActionItemVar.deleteThisActionItemReference(this.getName());
		return true;
	},
	onMouseOver: function(inSender, inEvent) {

		this.$.userTodoDeleteMark.applyStyle("visibility", "visible");
		return true;
	},
	onMouseOut: function(inSender, inEvent) {

		this.$.userTodoDeleteMark.applyStyle("visibility", "hidden");
		return true;
	}


});


//
//	End of Object which gets created dynamically
//
//	==================================================================================
//
//	==================================================================================
//
//	Beginning of Main App
//


enyo.kind({
	name: "MyApp",
	kind: "FittableRows",
	style: "background-image:url(assets/bg.png);",
	components:
	[
	    {
	    	kind: "Signals", 
	    	onbackbutton: "backButtonHandler"
	    },
		{
			// Title bar + Menu button
			name: "titleFittableRow",
			kind: "FittableRows",
			classes: "overall-width",
			style: "height:80px;margin:auto;",
			components:
			[{
				kind: "FittableColumns",
				style: "height:100%;padding-top:8px;",
				components:
				[
					{
						content: "To Dos",
						classes: "app-title",
						style: "width:65%;height:inherit;background-color:inherit;text-align:left;"
					},
					{
						name: "gearButton",
						kind: "onyx.Button",
						style: "float:right;margin-top:8px !important;height:50px;padding-top:4px;",
						ontap: "gearButtonHandler",
						components: [{
							name: "gearIcon",
							kind: "onyx.Icon",
							src: "assets/gearFour_40.png",
							style: "width:40px;height:40px;opacity:0.3;"
						}]
					}
				]
			}]
		},
		{
			// Display Top Border
			kind: "FittableRows",
			classes: "overall-width",
			style: "opacity:0.5;height:10px;margin:auto;background:-webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));"
		},
		{
			// Input Box to Create New TodoItem
			name: "createTodoItem",
			kind: "FittableRows",
			classes: "overall-width",
			style: "height:65px;margin:auto;background:white;border-bottom:1px gray solid;",
			components:
			[{
				kind: "FittableColumns",
				style: "height:100%;",
				components:
				[
					{
						content: "",
						style: "width:50px;height:inherit;background-color:inherit;text-align:center;"
					},
					{
						name: "userInput",
						kind: "onyx.Input",
						placeholder: "Enter Task",
						content: "",
						fit: true,
						onchange: "addItemToList",
						style: "font-style:italic;border:0px;margin:0px;height:inherit;background-color:inherit;font-size:24px;padding:10px;"
					}
				]
			}]
		},
		{
			//	Scrollable Area of dynamically added items
			kind: "enyo.Scroller",
			fit: true,
			horizontal: "hidden", 
			strategyKind: "TouchScrollStrategy", 
			components: 
			[
				{
					kind: "FittableRows",
					components:
					[
						{
							// Anchor on which to hang the dynamically created items
							tag: "div", 
							name: "listOfItems"
						}
					]
				}
			]
		},
		{
			// Bottom "spacer" so not up-against button of view
			kind: "FittableRows",
			style: "height:10px;"
		},
		{
			// Create the Gear (menu) PopUp Object
			name: "menuPopup",
			kind: "onyx.Popup",
		    scrim: true,
		    modal: false,
		    centered: true,
		    floating: true,
		    autoDismiss: false,
		    ontap: "dismissTapped",
			components: 
			[
				{content: "Reset",   style: "font-size:20px;padding:15px;text-align:center;", ontap: "resetTapped"},
				{content: "About",   style: "font-size:20px;padding:15px;text-align:center;", ontap: "aboutTapped"},
				{content: "Dismiss", style: "font-size:20px;padding:15px;text-align:center;", ontap: "dismissTapped"}
			]
		},
		{
			// Create the About PopUp Object
			name: "aboutPopup",
			kind: "onyx.Popup",
		    scrim: true,
		    modal: false,
		    centered: true,
		    floating: true,
		    autoDismiss: false,
		    ontap: "aboutPopupHide",
			components: 
			[{
				name: "popupContent",
				kind: "FittableRows",
	            allowHtml: true,
	            classes: "popup-style"
			}]
		}
	],
	//	=========================================
	//	=========================================
	nextItemInList: 0,
	itemPrefix: "actionItem_",
	localStorageAvailable: true,
	localStorageReference: "thisUniqueAppName",
	create: function()
	{
		this.inherited(arguments);

		if ( typeof(window.localStorage) == 'undefined' || window.localStorage === null)
		{
			// enyo.log("window.localStorage == FALSE");
			// alert("Local Storage = false", null, "", "OK");
			// navigator.notification.alert("Local Storage = false", null, "", "OK");
			this.localStorageAvailable = false;
		}
		else
		{
			this.localStorageAvailable = true;
			this.retrieveFromLocalStorage();
		}
	},
	//	=========================================
	saveToLocalStorage: function()
	{

		var storageObject = {
			"arrayOfObjects": []
		};

		var itemObject = {
			"text": "",
			"completionStatusFlag": false
		};

		if (this.localStorageAvailable)
		{

			if (this.$.listOfItems.controls.length > 0)
			{
				var listOfControls = this.$.listOfItems.getControls();
				for ( var i=0; i<listOfControls.length; i++)
				{

					var myComponents = listOfControls[i].getComponents();

					// enyo.log("["+i+"] A " + myComponents );

					var actionItemString = myComponents[2].getContent();
					// enyo.log("["+i+"] B " + actionItemString );

					itemObject = {
						"text": 				actionItemString,
						"completionStatusFlag": listOfControls[i].userTodoCompletionStatus
					};

					// enyo.log("itemObject.text => " + itemObject.text  + " => " + itemObject["text"]);
					// enyo.log("itemObject.completionStatusFlag => " + itemObject.completionStatusFlag  + " => " + itemObject["completionStatusFlag"]);
					storageObject.arrayOfObjects.push( itemObject );
				}
			}

			window.localStorage.setItem(this.localStorageReference, JSON.stringify(storageObject) );
		}
	},
	retrieveFromLocalStorage: function()
	{

		var storageObject = {
			"arrayOfObjects": []
		};

		var retrievedString = "";
		var retrievedObject = {};
		
		var deleteActionItemFunctionObject = {

			deleteThisActionItemReference: enyo.bind(this, this.deleteActionItem)
		};

		if (this.localStorageAvailable)
		{

			try {
				retrievedString = window.localStorage.getItem(this.localStorageReference);
			}
			catch (error) {
				enyo.log("getItem Failed.  Message = " + error.message);
				// alert(   "getItem Failed.  Message = " + error.message);
			}


			if (retrievedString != null)
			{

				retrievedObject = JSON.parse( retrievedString );

				this.nextItemInList = 0;
				for (var i=0; i<retrievedObject.arrayOfObjects.length; i++)
				{

					/*
					enyo.log("CreatingComponent: " + retrievedObject.arrayOfObjects[i].text + " : " 
						+ retrievedObject.arrayOfObjects[i].completionStatusFlag);
					*/

					this.createComponent({

						name: 					this.itemPrefix + this.nextItemInList,
						kind: 					"oneActionItem",
						container: 				this.$.listOfItems,
						userTodoString: 			  retrievedObject.arrayOfObjects[i].text,
						userTodoCompletionStatusFlag: retrievedObject.arrayOfObjects[i].completionStatusFlag,
						parentsThis: 			this,
						deleteActionItemObject: deleteActionItemFunctionObject
					});
					++this.nextItemInList;

				}
			
				this.$.listOfItems.render();
			}
			// else
			// {
			// 	enyo.log("retrieveFromLocalStorage: value == null");
			// 	alert(   "retrieveFromLocalStorage: value == null");
			// }
		}
		// else
		// {
		// 	enyo.log("localStorage not available");
		// 	alert(   "localStorage not available");
		// }
	},
	//	=========================================
	addItemToList: function(inSender, inEvent) {

		var deleteActionItemFunctionObject = {

			deleteThisActionItemReference: enyo.bind(this, this.deleteActionItem)
		};

		var userInputString = this.$.userInput.getValue();	// acquire user input
		this.$.userInput.setValue("");						// clear input field

		this.createComponent({

			name: this.itemPrefix + this.nextItemInList,
			kind: "oneActionItem",
			container: this.$.listOfItems,
			userTodoString: userInputString,
			userTodoCompletionStatusFlag: false,	// set default (start) value
			parentsThis: this,
			deleteActionItemObject: deleteActionItemFunctionObject
		});

		++this.nextItemInList;
		this.$.listOfItems.render();
		this.saveToLocalStorage();
	},
	removeItemFromList: function(localInput) {

		// This method called if using "parentsThis" from each child object.

		if (this.$.listOfItems.controls.length > 0)
		{

			var listOfComponents = this.getComponents();

			for ( var i=0; i<listOfComponents.length; i++)
			{
				// enyo.log("["+i+"] " + listOfComponents[i].getName());
				if (listOfComponents[i].getName() == localInput)
				{
					listOfComponents[i].destroy();
				}
			}
		}
		this.saveToLocalStorage();
		return true;
	},
	deleteActionItem: function (localInput) {

		// This method called if using bind() + function passed in as argument.

		if (this.$.listOfItems.controls.length > 0)
		{

			var listOfComponents = this.getComponents();

			for ( var i=0; i<listOfComponents.length; i++)
			{
				// enyo.log("["+i+"] " + listOfComponents[i].getName());
				if (listOfComponents[i].getName() == localInput)
				{
					listOfComponents[i].destroy();
				}
			}
		}
		this.saveToLocalStorage();
		return true;
	},
	//	=============================================
	//	Methods for Menu (Gear) Popup
	//
	aboutTapped: function(inSender, inEvent) {

		// PopUp for product and personal credit

		var popupContentString = "";
		popupContentString += "This app loosely based on TodoMVC<br />";
		popupContentString += "Javascript Framework is Enyo<br />";
		popupContentString += "Platform Support by Cordova<br />";
		popupContentString += "Programmed by Troy<br />";
		popupContentString += "Copyright 2014 by Troy";

		this.$.menuPopup.hide();
		this.$.popupContent.setContent(popupContentString);
		this.$.aboutPopup.show();
		return true;
	},
	aboutPopupHide: function(inSender, inEvent) {

		this.$.aboutPopup.hide();

		// delay 400 ms before re-enabling Input field
		setTimeout( function() {  this.$.userInput.setDisabled(false); }.bind(this) , 400);	

		// Alternate strategy would be to delay "hiding" the "aboutPopup"
		// setTimeout( function() { this.$.aboutPopup.hide(); }.bind(this) , 400);

		//
		// Why 400 ms ?
		//
		// When this program is run without any delay, a tap (or touch) to dismiss any of the popups
		// would always cause the input field to becoem active if touch event was over the input field.
		//
		// This would bring up the keyboard when it is not requested.
		//
		// By temporarily deactivating the input field and restoring it after the popups are gone, the 
		// problem goes away.
		// 
		// Through trial and error, I found a delay of 300 ms is not enough but a delay of 400 ms works well.
		//

		return true;
	},
	resetTapped: function(inSender, inEvent) {

		if (this.$.listOfItems.controls.length > 0)
		{

			var listOfComponents = this.getComponents();
			var lengthOfPrefix = this.itemPrefix.length;

			for ( var i=0; i<listOfComponents.length; i++)
			{
				// enyo.log("["+i+"] " + listOfComponents[i].getName());
				// enyo.log("["+i+"] " + listOfComponents[i].getName().substring(0, lengthOfPrefix));
				if (listOfComponents[i].getName().substring(0, lengthOfPrefix) == this.itemPrefix)
				{
					listOfComponents[i].destroy();
				}
			}
		}
		this.saveToLocalStorage();

		this.$.menuPopup.hide();
		setTimeout( function() { this.$.userInput.setDisabled(false); }.bind(this) , 400);

		// Alternate strategy would be to delay "hiding" the "menuPopup"
		// setTimeout( function() { this.$.menuPopup.hide(); }.bind(this) , 400);

		return true;
	},
	dismissTapped: function(inSender, inEvent) {

		this.$.menuPopup.hide();
		setTimeout( function() { this.$.userInput.setDisabled(false); }.bind(this) , 400);

		// Alternate strategy would be to delay "hiding" the "menuPopup"
		// setTimeout( function() { this.$.menuPopup.hide(); }.bind(this) , 400);

		return true;
	},
	menuButtonHandler: function(inSender, inEvent) {

		// this.$.userInput.setDisabled(true);
		return true;
	},
	gearButtonHandler: function(inSender, inEvent) {

		this.$.menuPopup.show();
		this.$.userInput.setDisabled(true);

		return true;
	},
	//	=============================================
	backButtonHandler: function(inSender, inEvent) {

		// Needed for Android platform.
		// Causes app to exit when "back button" is pressed.
		// On iOS it has no effect.

		navigator.app.exitApp(); 
	}



});



//	==================================================================================
//	End of File
//







