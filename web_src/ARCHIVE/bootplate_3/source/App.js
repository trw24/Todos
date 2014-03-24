


enyo.kind({

	name: "oneActionItem",
	kind: "FittableRows",
	style: "width:548px;height:59px;margin:auto;background:white;border-bottom: 1px dotted #ccc;",
	published: {
		userTodoString: "",
		parentsThis: "",
		index: "",
		deleteActionItemObject: {}
	},
	handlers: {
		onmouseover: "onMouseOver",
		onmouseout: "onMouseOut",
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
				style: "border-right: 1px solid red;font-size: 20px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;"
			},
			{
				name: "userTodoString",
				content: "",
				fit: true,
				onchange: "userTodoStringChanged",
				classes: "task-format",
				style: "border:0px;margin:0px;height:inherit;background-color:inherit;padding:15px;"
			},
			{
				content: '✖',
				name: "userTodoDeleteMark",
				ontap: "itemDelete",
				style: "visibility:hidden;font-size: 22px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;"
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
		this.indexChanged();
		this.deleteActionItemObjectChanged();
	},
	userTodoStringChanged: function() {

		this.$.userTodoString.setContent(this.userTodoString);
		return true;
	},

	parentsThisChanged: function() {

		this.parentsThisVar = this.parentsThis;
		return true;
	},

	indexChanged: function() {

		enyo.log("starting index = " + this.index);
		return true;
	},

	deleteActionItemObjectChanged: function() {

		// this.localDeleteActionItemVar = this.deleteActionItemObject. ??? ;
		return true;
	},

	itemComplete: function(inSender, inEvent) {

		this.userTodoCompletionStatus = !this.userTodoCompletionStatus;		// toggle flag
		this.$.userTodoString.addRemoveClass("task-now-complete", this.userTodoCompletionStatus);
		this.$.userTodoCheckMark.addRemoveClass("checkmark-now-complete", this.userTodoCompletionStatus);
		return true;
	},
	itemDelete: function(inSender, inEvent) {


		// This is place where want I want "kind" to delete itself.
		// But, I can't seem to figure out way to accomplish this task.


		enyo.log("=======================")
		enyo.log("Inside: itemDelete");


		enyo.log("-----------------");
		enyo.log("this.getName() = " + this.getName());
		enyo.log("-----------------");
		enyo.log("this.id = " + this.id);
		enyo.log("-----------------");






		if (this.hasNode()) {
			enyo.log("hasNode is true");
		    enyo.log("this.node.id = " + this.node.id);
		    enyo.log("this.getName() = " + this.getName());

		    // this.hasNode().destroy();
		}
		else
		{
			enyo.log("hasNode is false");
		}

		enyo.log("this.parentsThisVar.id = " + this.parentsThisVar.id);

	    enyo.log("this.node.id = " + this.node.id);

	    enyo.log("parentsThisVar.specialFunction: ");
	    this.parentsThisVar.specialFunction(this.getName());		


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







// =========================================

enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	style: "background-image:url(assets/bg.png)",
	components:
	[
		{
			// Display Main Title
			content: "todos",
			style: "opacity:0.2;text-rendering: optimizeLegibility;text-shadow: -1px -1px rgba(0, 0, 0, 0.2);font-color:rgba(255, 255, 255, 0.3);font-weight:bold;font-size:70px;text-align:center;margin-top:20px;margin-bottom:20px;"
		},
		//	=====================================
		{
			tag: "button",
			name: "DeleteFirstActionItem",
			content: "Delete First Action Item",
			ontap: "deleteFirstActionItem"
		},
		// {
		// 	tag: "button",
		// 	name: "DeleteLastActionItem",
		// 	content: "Delete Last Action Item",
		// 	ontap: "deleteLastActionItem"
		// },
		//	=====================================
		{
			// Display Top Border
			kind: "FittableRows",
			style: "width:548px;height:15px;margin:auto;background:-webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));"
		},
		{
			// Input Box to Create New TodoItem
			name: "createTodoItem",
			kind: "FittableRows",
			style: "width:548px;height:65px;margin:auto;background:white;border-bottom:1px gray solid;",
			components:
			[
			{
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
						placeholder: "Enter One Task Here",
						content: "",
						fit: true,
						onchange: "addItemToList",
						style: "font-style:italic;border:0px;margin:0px;height:inherit;background-color:inherit;font-size:24px;padding:15px;"
					}
				]
			}
			]
		},
		{
			tag: "div", 
			name: "listOfItems"
		}
	],
	nextItemInList: 0,
	lastActionItemId: "",
	create: function()
	{
		this.inherited(arguments);
	},

	deleteActionItem: function deleteActionItemFunction (localInput) {

		enyo.log("deleteActionItem.  localInput = " + localInput);
		return true;
	},

	addItemToList: function(inSender, inEvent) {

		// enyo.log("addItemToList: Start");
		// enyo.log("this.nextItemInList = " + this.nextItemInList);

		// enyo.log(inSender);
		// enyo.log(inEvent);

		var deleteActionItemFunctionObject = {

			deleteThisActionItemReference: enyo.bind(this, this.deleteActionItem)
		};

		this.lastActionItemId = "app_actionItem_" + this.nextItemInList;

		this.createComponent({

			name: "actionItem_" + this.nextItemInList,
			kind: oneActionItem,
			container: this.$.listOfItems,
			userTodoString: this.$.userInput.getValue(),
			parentsThis: this,
			index: this.nextItemInList,
			deleteActionItemObject: deleteActionItemFunctionObject
		});

		++this.nextItemInList;
		this.$.listOfItems.render();

		this.$.userInput.setValue("");	// clear input

		// enyo.log(this.$.listOfItems);
		// enyo.log("addItemToList: End");

	},
	deleteLastActionItem: function() {

		enyo.log("=======================")
		enyo.log("deleteLastActionItem: lastActionItemId = " + this.lastActionItemId);

		enyo.log("-----------------");
		enyo.log(this.getName());
		enyo.log("-----------------");
		enyo.log(this.id);
		enyo.log("-----------------");
		enyo.log(this.children);
		enyo.log("-----------------");

		if (this.hasNode()) {
			enyo.log("hasNode is true");
		    enyo.log(this.node.id);
		}
		else
		{
			enyo.log("hasNode is false");
		}

		enyo.log("=======================");

	},
	deleteFirstActionItem: function() {

		// enyo.log("Deleting First Item");

		// this.destroyObject("app_actionItem_0");	// this does not work :-(

		if (this.children[4].children.length > 0) {

			this.children[4].children[0].destroy();
		} else {
			enyo.log("No items remaining to delete");
		}

		// use index=3 when extra buttons are NOT included before the listItems
		// use index=5 when extra buttons ARE included before the listItems

		// this.destroyObject("app_actionItem_0");
		// this.render();
	},

	specialFunction: function(localInputValue) {

		enyo.log("special function: inputValue = " + localInputValue);


		enyo.log("length # 1 = " + this.$.listOfItems.controls.length);


		if (this.$.listOfItems.controls.length > 0)
		{

			var listOfComponents = this.getComponents();

			enyo.log("length # 2 = " + listOfComponents.length);

			for ( var i=0; i<listOfComponents.length; i++)
			{
				enyo.log("["+i+"] " + listOfComponents[i].getName());
				if (listOfComponents[i].getName() == localInputValue)
				{
					listOfComponents[i].destroy();
				}
			}
		}




		return true;
	}








});










