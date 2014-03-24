//
//	Troy's scaled down version of TodoMVC
//
// =========================================


enyo.kind({

	name: "oneActionItem",
	kind: "FittableRows",
	style: "width:548px;height:59px;margin:auto;background:white;border-bottom: 1px dotted #ccc;",
	published: {
		userTodoString: "",
		parentsThis: "",
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
				ontap: "itemDeleteWithBind",		// Do "delete" with function passed in as object
				// ontap: "itemDelete",				// Do "delete" with "parentsThis"
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
	create: function()
	{
		this.inherited(arguments);
	},
	addItemToList: function(inSender, inEvent) {

		var deleteActionItemFunctionObject = {

			deleteThisActionItemReference: enyo.bind(this, this.deleteActionItem)
		};

		this.createComponent({

			name: "actionItem_" + this.nextItemInList,
			kind: oneActionItem,
			container: this.$.listOfItems,
			userTodoString: this.$.userInput.getValue(),
			parentsThis: this,
			deleteActionItemObject: deleteActionItemFunctionObject
		});

		++this.nextItemInList;
		this.$.listOfItems.render();

		this.$.userInput.setValue("");	// clear input
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
		return true;
	},
	deleteActionItem: function deleteActionItemFunction (localInput) {

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
		return true;
	}








});


// =========================================
// End of File
//







