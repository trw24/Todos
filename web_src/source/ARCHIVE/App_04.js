//
//	Troy's scaled down version of TodoMVC
//
//	===========================================================
//
//	CordovaListener.js
//

myApp = {};

enyo.kind({
	name: "CordovaListener",
	components: [
	    {kind: "Signals", ondeviceready: "deviceReadyHandler"}
	],
	deviceReadyHandler: function() {

		// navigator.notification.alert("Device is ready", null, "Cordova-Enyo", "OK");

		myApp = new MyApp();
		myApp.renderInto(document.body);

	},
	create: function() {

		this.inherited(arguments);

		this.deviceReadyHandler();		// used when not expecting "deviceready" event
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


// Here is new "menu" item

		// {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
		// 	{content: "Popup menu (floating)"},
		// 	{kind: "onyx.Menu", floating: true, components: [
		// 		{content: "1"},
		// 		{content: "2"},
		// 		{classes: "onyx-menu-divider"},
		// 		{content: "3"}
		// 	]}
		// ]},

		// {
		// 	kind: "onyx.MenuDecorator",
		// 	onSelect: "itemSelected",
		// 	style: "text-align:right;",
		// 	components: 
		// 	[
		// 		{content: "Options"},
		// 		{
		// 			kind: "onyx.Menu", 
		// 			floating: true, 
		// 			components: 
		// 			[
		// 				{content: "1"},
		// 				{content: "2"},
		// 				{classes: "onyx-menu-divider"},
		// 				{content: "3"}
		// 			]
		// 		}
		// 	]
		// },

		// itemSelected: function(inSender, inEvent) {
		// 	//Menu items send an onSelect event with a reference to themselves & any directly displayed content
		// 	if (inEvent.originator.content){
		// 		this.$.menuSelection.setContent(inEvent.originator.content + " Selected");
		// 	} else if (inEvent.selected){
		// 		//	Since some of the menu items do not have directly displayed content (they are kinds with subcomponents),
		// 		//	we have to handle those items differently here.
		// 		this.$.menuSelection.setContent(inEvent.selected.controlAtIndex(1).content + " Selected");
		// 	}
		// }




enyo.kind({
	name: "MyApp",
	kind: "FittableRows",
	style: "background-image:url(assets/bg.png)",
	components:
	[
	    {
	    	kind: "Signals", 
	    	onbackbutton: "backButtonHandler"
	    },
		

						{
							// New "revised" Title bar ++ Menu button
							name: "titleFittableRow",
							kind: "FittableRows",
							classes: "overall-width",
							style: "height:65px;margin:auto;",
							components:
							[{
								kind: "FittableColumns",
								style: "height:100%;",
								components:
								[
									{
										content: "To Dos",
										classes: "app-title",
										style: "width:60%;height:inherit;background-color:inherit;text-align:left;"
									},


									{
										kind: "onyx.MenuDecorator",
										// onSelect: "itemSelected",
										style: "width:40%;",
										components: 
										[
											{
												content: "Options",
												style: "float:right; margin-top:20px;"
											},
											{
												kind: "onyx.Menu", 
												floating: true, 
												components: 
												[

													{content: "Reset", ontap: "resetTapped"},
													{content: "About", ontap: "aboutTapped"}

												]
											}
										]
									}


								]
							}]
						},

						{
							// Display Top Border
							kind: "FittableRows",
							classes: "overall-width",
							style: "height:15px;margin:auto;background:-webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));"
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
										kind: "onyx.Input",
										name: "userInput",
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
		//	=============================================
		//	Now part of Menu button in upper right of app
		// {
		// 	// Display Bottom "FittableRow" with "Reset" and "About" buttons
		// 	kind: "FittableRows",
		// 	style: "height:32px;margin:20px;",
		// 	// style: "height:32px;margin:20px;text-align:center;",
		// 	components: [
		// 		{kind: "onyx.Button", style: "margin:auto;float:left;",  content: "Reset", ontap: "resetTapped"},
		// 		{kind: "onyx.Button", style: "margin:auto;float:right;", content: "About", ontap: "aboutTapped"}
		// 	]
		// },
		//	=============================================
		{
			// Create the PopUp Object
			name: "aboutPopup",
			kind: "onyx.Popup",
		    autoDismiss: true,
		    modal: false,
		    scrim: true,
		    centered: true,
		    ontap: "aboutHide",
			components: 
			[{
				name: "popupContent",
				kind: "FittableRows",
	            allowHtml: true,
                style: "font-size:18px;padding: 15px;line-height: 150%;background-color:#C9B4A5;text-align: center;"
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


		if ( typeof(window.localStorage) == 'undefined' || window.localStorage === null)
		{
			// enyo.log("window.localStorage == FALSE");
			// navigator.notification.alert("Local Storage = false", null, "", "OK");
			this.localStorageAvailable = false;
		}
		else
		{
			// enyo.log("window.localStorage == TRUE");
			// navigator.notification.alert("Local Storage = true", null, "", "OK");
			this.localStorageAvailable = true;

			// Run this line when app does not load correctly
			// It fources saved values to be cleared
			//
			// this.resetTapped();
			//

			this.retrieveFromLocalStorage();
		}


		// sample code for testing browser support of local storage
		// if('localStorage' in window && window['localStorage'] !== null){
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

			retrievedString = window.localStorage.getItem(this.localStorageReference);
			retrievedObject = JSON.parse( retrievedString );

			// console.log("retrieveFromLocalStorage: A = " + retrievedObject);
			// console.log("retrieveFromLocalStorage: B = " + retrievedObject.arrayOfObjects);
			// console.log("retrieveFromLocalStorage: C = " + retrievedObject.arrayOfObjects.length);

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
		else
		{
			console.log("retrieveFromLocalStorage: value = null");
			// window.alert("retrieveFromLocalStorage: value = null");
		}

		// console.log("retrieveFromLocalStorage: about to exit");

	},

	// localStorage.setItem( 'car', JSON.stringify(car) );
	// console.log( JSON.parse( localStorage.getItem( 'car' ) ) );
	// JSON.stringify() and JSON.parse() (or eval() )
	// localStorage["name"] = username

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
	aboutTapped: function(inSender, inEvent) {
		// PopUp for product and personal credit

		var popupContentString = "";
		popupContentString += "This app loosely based on TodoMVC<br />";
		popupContentString += "Javascript Framework is Enyo<br />";
		popupContentString += "Platform Support by Cordova<br />";
		popupContentString += "Programmed by Troy";

		this.$.popupContent.setContent(popupContentString);
		this.$.aboutPopup.show();
	},
	aboutHide: function(inSender, inEvent) {

		this.$.aboutPopup.hide();
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
		return true;
	},
	backButtonHandler: function(inSender, inEvent) {

		// Two possible mods:
		// add try/catch, and
		// test for Android platform

		navigator.app.exitApp(); 
	}



});



//	===========================================================
//	End of File
//







