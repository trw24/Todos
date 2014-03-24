//
//	Troy's scaled down version of TodoMVC
//
//	=========================================
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
		this.userTodoStringChanged();
		this.parentsThisChanged();
		this.deleteActionItemObjectChanged();
	},
	userTodoCompletionStatusFlagChanged: function() {

		this.userTodoCompletionStatus = this.userTodoCompletionStatusFlag;
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
//	============================================
//
//	Beginning of Main App
//

enyo.kind({
	name: "App",
	kind: "FittableRows",
	style: "background-image:url(assets/bg.png)",
	components:
	[
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
							// Display Main Title
							content: "todos",
							style: "opacity:0.2;text-rendering: optimizeLegibility;text-shadow: -1px -1px rgba(0, 0, 0, 0.2);font-color:rgba(255, 255, 255, 0.3);font-weight:bold;font-size:70px;text-align:center;margin-top:20px;margin-bottom:20px;"
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
			// Display Bottom "FittableRow" with "About" botton
			kind: "FittableRows",
			style: "height:32px;margin:20px;",
			// style: "height:32px;margin:20px;text-align:center;",
			components: [
				{kind: "onyx.Button", style: "margin:auto;float:left;", content: "Reset", ontap: "resetTapped"},
				{kind: "onyx.Button", style: "margin:auto;float:right;", content: "About", ontap: "aboutTapped"}
			]
		},
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
	            // style: "padding: 15px;line-height: 150%;background-color:#C9B4A5;text-align: center;"
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

		if(typeof(Storage) !== "undefined")
		{
			console.log("create: localStorage == true");
			this.localStorageAvailable = true;
			this.retrieveFromLocalStorage();
		}
		else
		{
			console.log("create: localStorage == false");
			this.localStorageAvailable = false;
		}

		// if('localStorage' in window && window['localStorage'] !== null){
		// var store = window.localStorage;
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

					enyo.log("["+i+"] AA " + listOfControls[i]);

					var myComponents = listOfControls[i].getComponents();
					// enyo.log("["+i+"] A " + myComponents );

					var moreComponents = myComponents[2].getContent();
					enyo.log("["+i+"] B " + moreComponents );


					// right here:  got to determine objects "completion status flag" value


					itemObject = {
						"text": moreComponents
					};

					enyo.log("itemObject.text => " + itemObject.text  + " => " + itemObject["text"]);
					storageObject.arrayOfObjects.push( itemObject );
					// storageObject.arrayOfObjects.push( moreComponents );
				}
			}

			/*
			console.log("saveToLocalStorage: storageObject = " 				  + storageObject  );
			console.log("saveToLocalStorage: storageObject.arrayOfObjects = " + storageObject.arrayOfObjects  );
			console.log("saveToLocalStorage: storageObject = " 				  + JSON.stringify(storageObject)  );
			*/

			localStorage.setItem(this.localStorageReference, JSON.stringify(storageObject) );

		}

		// enyo.byId(id, doc) - returns getElementById on document doc (or on document if not specified), or returns what was passed into it if there is no element by that name
		// example: localStorage.setItem('favoriteflavor','vanilla');
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

			retrievedString = localStorage.getItem(this.localStorageReference);
			retrievedObject = JSON.parse( retrievedString );
			// retrievedObject = eval( "(" + retrievedString + ")");

			// console.log("retrieveFromLocalStorage: A = " + retrievedObject);
			// console.log("retrieveFromLocalStorage: B = " + retrievedObject.arrayOfObjects);
			// console.log("retrieveFromLocalStorage: C = " + retrievedObject.arrayOfObjects.length);

			this.nextItemInList = 0;
			for (var i=0; i<retrievedObject.arrayOfObjects.length; i++)
			{

				this.createComponent({

					name: this.itemPrefix + this.nextItemInList,
					kind: "oneActionItem",
					container: this.$.listOfItems,
					userTodoString: retrievedObject.arrayOfObjects[i].text,
					userTodoCompletionStatusFlag: retrievedObject.arrayOfObjects[i].completionStatusFlag,
					parentsThis: this,
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

		// example: var taste = localStorage.getItem('favoriteflavor');
	},
	/*
	// This method no longer used
	clearLocalStorage: function()
	{

		var storageObject = {
			"arrayOfObjects": []
		};

		storageObject.arrayOfObjects.push("first entry");

		if (this.localStorageAvailable)
		{
			localStorage.setItem(this.localStorageReference, JSON.stringify(storageObject) );
			// localStorage.removeItem(this.localStorageReference);
			console.log("clearLocalStorage: Cleared");
		}
		else
		{
			console.log("clearLocalStorage: Not Available");
		}

		// example: localStorage.removeItem('favoriteflavor');
	},
	*/

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
		// this.clearLocalStorage();
		return true;
	}



});



//	=========================================
//	End of File
//







