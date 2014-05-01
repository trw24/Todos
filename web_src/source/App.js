//
//	Troy's scaled down version of TodoMVC
//
//	===========================================================
//
//	CordovaListener.js
//

var myApp = {};


var MyCordovaListener = enyo.kind({
	// name: "CordovaListener",
	components: [
	    {kind: "Signals", ondeviceready: "deviceReadyHandler"}
	],
	create: function() {

		this.inherited(arguments);
		// alert("CordovaListener: create()");
		// enyo.log("CordovaListener: create()");

		//
		// used when not expecting "deviceready" event
		// when run in non-cordova environment, un-comment this line
		// this.deviceReadyHandler();
		// 
	},
	deviceReadyHandler: function() {

		// enyo.log("CordovaListener: deviceReadyHandler()");
		// alert("CordovaListener: deviceReadyHandler()");
		// navigator.notification.alert("Device is ready", null, "Cordova-Enyo", "OK");

		myApp = new MyApp();
		myApp.renderInto(document.body);

	}

});

//
//
//	===========================================================
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
		// on a physical device (only works in browsers)
		// onmouseover: "onMouseOver",
		// onmouseout: "onMouseOut",
	},
	components:
	[{
		kind: "FittableColumns",
		style: "height:100%;",
		components:
		[

			// ============================================================
			// Attempt to center check mark with a table: -- did not work.
			// <table style="width: 100%; height: 100%;">
			// 	<tr>
			// 		<td style="vertical-align: middle; text-align: center">
			//         	Aligned content here...
			//     	</td>
			//     </tr>
			// </table>
			//
    		// {
    		// 	tag: "table",
    		// 	style: "width:50px; height:100%;",
    		// 	components:
    		// 	[{
    		// 		tag: "tr",
    		// 		components:
    		// 		[{
    		// 			tag: "td",
    		// 			style: "vertical-align:middle;text-align:center;",
    		// 			content: "X"
    		// 		}]
    		// 	}]
    		// },
    		// ----------------------------------------
    		// Attempt to vertially align middle with these commands -- did not work:
			// display:-webkit-box;
			// -webkit-box-pack:center;
			// -webkit-box-align:center;
			// ============================================================

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
				/* style: "visibility:hidden;font-size: 22px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;" */
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
		// enyo.log("Deleting item with itemDelete()");
		this.parentsThisVar.removeItemFromList(this.getName());		
		return true;
	},
	itemDeleteWithBind: function(inSender, inEvent) {

		// enyo.log("Deleting item with itemDeleteWithBind()");
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
//	===========================================================
//
//	===========================================================
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
			// Title bar ++ Menu button
			name: "titleFittableRow",
			kind: "FittableRows",
			// classes: "overall-width",
			style: "height:80px;margin:auto;width:90%;",
			// style: "height:65px;margin:auto;width:90%;",
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
					/*
					//	=======================================================
					{
						name: "menuDecorator",
						kind: "onyx.MenuDecorator",
						style: "width:35%;",
						components: 
						[
							{
								name: "menuButton",
								style: "float:right;margin-top:8px;height:50px;padding-top:4px;",
								ontap: "menuButtonHandler",
								components: [{
									name: "gearIcon",
									kind: "onyx.Icon",
									src: "assets/gearFour_40.png",
									style: "width:40px;height:40px;opacity:0.3;"
								}]
							},
							{
								name: "realMenu",
								// kind: "onyx.Popup",	// new ???
								kind: "onyx.Menu", 
								floating: true,
								scrim: true,
								style: "min-width:110px;float:right;",
								components: 
								[
									{content: "Reset", style: "font-size:20px;padding:15px;", ontap: "resetTapped"},
									{content: "About", style: "font-size:20px;padding:15px;", ontap: "aboutTapped"}
								]
							}
						]
					}
					//	=======================================================
					*/
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
			//	===================================	
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
			//	===================================	
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
		    autoDismiss: false,
		    modal: false,
		    scrim: true,
		    centered: true,
		    floating: true,
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
		    autoDismiss: false,
		    modal: false,
		    scrim: true,
		    centered: true,
		    floating: true,
		    ontap: "aboutPopupHide",
		    // onHide: "aboutPopupHide",
			components: 
			[{
				name: "popupContent",
				kind: "FittableRows",
	            allowHtml: true,
	            classes: "popup-style"
			}]
		}
	],
	//	========================
	//	========================
	nextItemInList: 0,
	itemPrefix: "actionItem_",
	localStorageAvailable: true,
	localStorageReference: "thisUniqueAppName",
	create: function()
	{
		this.inherited(arguments);
		// enyo.log("MyApp:  create()");
		// alert("MyApp:  create()");


		if ( typeof(window.localStorage) == 'undefined' || window.localStorage === null)
		{
			// enyo.log("window.localStorage == FALSE");
			// alert("Local Storage = false", null, "", "OK");
			// navigator.notification.alert("Local Storage = false", null, "", "OK");
			this.localStorageAvailable = false;
		}
		else
		{
			// enyo.log("window.localStorage == TRUE");
			// alert("Local Storage = true", null, "", "OK");
			this.localStorageAvailable = true;

			//
			// Run this line when app does not load correctly
			// It forces saved values to be cleared
			//
			// this.resetTapped();
			//

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
			// console.log("saveToLocalStorage()");

			if (this.$.listOfItems.controls.length > 0)
			{
				var listOfControls = this.$.listOfItems.getControls();
				for ( var i=0; i<listOfControls.length; i++)
				{

					// enyo.log("["+i+"] AA " + listOfControls[i]);
					// enyo.log("["+i+"] AA " + listOfControls[i].getControls() );
					// enyo.log("["+i+"] AA " + listOfControls[i].getComponents() );
					// enyo.log("["+i+"] AA " + listOfControls[i].getContent() );
					// enyo.log("["+i+"] AA " + listOfControls[i].getName());
					// enyo.log("["+i+"] AAA " + listOfControls[i].userTodoCompletionStatus);

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

			/*
			console.log("saveToLocalStorage: storageObject = " 				  + storageObject  );
			console.log("saveToLocalStorage: storageObject.arrayOfObjects = " + storageObject.arrayOfObjects  );
			console.log("saveToLocalStorage: storageObject = " 				  + JSON.stringify(storageObject)  );
			*/

			window.localStorage.setItem(this.localStorageReference, JSON.stringify(storageObject) );

		}

		// enyo.byId(id, doc) - returns getElementById on document doc (or on document if not specified), or returns what was passed into it if there is no element by that name
	},
	retrieveFromLocalStorage: function()
	{

		// enyo.log("retrieveFromLocalStorage()");
		// alert("retrieveFromLocalStorage()");

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

			// enyo.log("retrieveFromLocalStorage:  About to perform getItem()");
			// alert("retrieveFromLocalStorage:  About to perform getItem()");

			try {
				retrievedString = window.localStorage.getItem(this.localStorageReference);
			}
			catch (error) {
				enyo.log("getItem Failed.  Message = " + error.message);
				// alert(   "getItem Failed.  Message = " + error.message);
			}

			// enyo.log("After CATCH");
			// alert(   "After CATCH");

			// if (retrievedString == null)			alert("R.S. == null");
			// if (retrievedString === null)			alert("R.S. === null");


			if (retrievedString != null)
			{

				// enyo.log("retrieveFromLocalStorage: value != null");
				// alert(   "retrieveFromLocalStorage: value != null");

				// enyo.log("retrievedString.lenth = " + retrievedString.length);
				// alert("retrievedString.lenth = " + retrievedString.length);

				retrievedObject = JSON.parse( retrievedString );

				if (retrievedObject == null)			enyo.log("R.O. == null");
				if (retrievedObject === null)		enyo.log("R.O. === null");

				// enyo.log("retrieveFromLocalStorage:  Completed getItem()");
				// alert(   "retrieveFromLocalStorage:  Completed getItem()");

				
				// alert("retrieveFromLocalStorage: B = " + retrievedObject.arrayOfObjects);
				// alert("retrieveFromLocalStorage: C = " + retrievedObject.arrayOfObjects.length);

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

		this.createComponent({

			name: this.itemPrefix + this.nextItemInList,
			kind: "oneActionItem",
			container: this.$.listOfItems,
			userTodoString: this.$.userInput.getValue(),
			userTodoCompletionStatusFlag: false,	// set default (start) value
			parentsThis: this,
			deleteActionItemObject: deleteActionItemFunctionObject
		});

		++this.nextItemInList;
		this.$.listOfItems.render();

		this.$.userInput.setValue("");	// clear input

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
		// enyo.log("deleteActionItem.  localInput = " + localInput);

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
	//	=============================================
	//	=============================================
	//	Methods for Menu (Gear) Popup
	//
	aboutTapped: function(inSender, inEvent) {
		// PopUp for product and personal credit

		enyo.log("aboutTapped");

		var popupContentString = "";
		popupContentString += "This app loosely based on TodoMVC<br />";
		popupContentString += "Javascript Framework is Enyo<br />";
		popupContentString += "Platform Support by Cordova<br />";
		popupContentString += "Programmed by Troy";


		// setTimeout(function(){ this.$.menuPopup.hide(); },2000);
		// this.startJob("clearSecond", function() { this.$.menuPopup.hide(); }, 2000);


		this.$.menuPopup.hide();
		this.$.popupContent.setContent(popupContentString);
		this.$.aboutPopup.show();
		// enyo.log("Input: Enable");
		// this.$.userInput.setDisabled(false);
		// setTimeout(function(){enyo.log("aboutTapped ... delayed")},1000);
		enyo.log("aboutTapped: before exit");
		return true;
	},
	// aboutPopupTapped: function(inSender, inEvent) {
	// 	enyo.log("aboutPopupTapped");
	// 	this.aboutPopupHide();
	// },
	aboutPopupHide: function(inSender, inEvent) {

		enyo.log("aboutHide: before setTimeout");
		// enyo.log("Input: Enable");
		// this.$.userInput.setDisabled(false);
		// this.$.aboutPopup.hide();

		// This line works fine:
		// setTimeout( function() { enyo.log("Inside function"); this.$.aboutPopup.hide(); }.bind(this) , 400);


		this.$.aboutPopup.hide();
		setTimeout( function() {  enyo.log("Inside function"); this.$.userInput.setDisabled(false); }.bind(this) , 400);


		// this.$.aboutPopup.hide();

		// setTimeout(function(){ this.$.aboutPopup.hide(); },2000);
		
		// this.startJob("clearSecond", function() { this.$.aboutPopup.hide(); }, 2000);
		// setTimeout(function(){enyo.log("aboutHide ... delayed")},1000);
		enyo.log("aboutHide: before exit");
		return true;
	},
	resetTapped: function(inSender, inEvent) {

		enyo.log("resetTapped");

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
		// enyo.log("Input: Enable");
		// this.$.userInput.setDisabled(false);
		// setTimeout(function(){enyo.log("resetTapped ... delayed")},1000);


		enyo.log("resetTapped: before setTimeout");

		// this.$.menuPopup.hide();
		// this line works fine:
		// setTimeout( function() { enyo.log("Inside function"); this.$.menuPopup.hide(); }.bind(this) , 400);

		this.$.menuPopup.hide();
		setTimeout( function() {  enyo.log("Inside function"); this.$.userInput.setDisabled(false); }.bind(this) , 400);

		// setTimeout(function(){ this.$.menuPopup.hide(); },2000);

		// this.startJob("clearSecond", function() { this.$.menuPopup.hide(); }, 2000);
		enyo.log("resetTapped: before exit");
		return true;
	},
	dismissTapped: function(inSender, inEvent) {

		enyo.log("dismissTapped: before setTimeout");

		//
		// This line works fine when set to 400 ms
		// setTimeout( function() {  enyo.log("Inside function"); this.$.menuPopup.hide(); }.bind(this) , 400);
		//

		// Now, when delaying the "hide", the following numbers work.
		// 200 -> does not work
		// 300 -> does NOT work
		// 400 -> does work


		// Now, testing for case when re-activating the input field after the touch:

		// with 400 -> it works fine
		// with 200 -> does NOT work
		// with 100 -> does NOT work


		this.$.menuPopup.hide();
		setTimeout( function() {  enyo.log("Inside function"); this.$.userInput.setDisabled(false); }.bind(this) , 400);


		// var myFunction = enyo.bind(this, function(){ enyo.log("inside bound function"); /* this.$.menuPopup.hide(); */ } );
		// setTimeout(myFunction(), 2000);

		// this.$.menuPopup.hide();

		enyo.log("dismissTapped: before exit");
		return true;
	},
	backButtonHandler: function(inSender, inEvent) {

		// Needed for Android platform.
		// Causes app to exit when "back button" is pressed.
		// On iOS it has no effect.

		navigator.app.exitApp(); 
	},
	menuButtonHandler: function(inSender, inEvent) {

		// enyo.log("Input: Disable");
		// this.$.userInput.setDisabled(true);
		return true;
	},
	gearButtonHandler: function(inSender, inEvent) {

		this.$.menuPopup.show();
		this.$.userInput.setDisabled(true);

		// this.startJob("clearSecond", function() { this.$.menuPopup.hide(); }, 2000);
		// this.startJob("clearSecond", function() { this.$.secondPopup.hide(); }, 2000);

		// if(this.$.modalPopup.showing) {   // Refocus input on modal popup
		// 	this.startJob("focus", function() { this.$.input.focus(); }, 500);
		// }
		return true;
	}




});



//	===========================================================
//	End of File
//







