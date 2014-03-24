enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	style: "background-image:url(assets/bg.png)",
	published: {
		userTodoCompletionStatus: false
	},
	components:
	[
		{
			// Main Title
			content: "todos",
			style: "opacity:0.2;text-rendering: optimizeLegibility;text-shadow: -1px -1px rgba(0, 0, 0, 0.2);font-color:rgba(255, 255, 255, 0.3);font-weight:bold;font-size:70px;text-align:center;margin-top:20px;margin-bottom:20px;"
		},
		{
			// Top Border
			kind: "FittableRows",
			style: "width:548px;height:15px;margin:auto;background:-webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));"
		},
		//	========================================
		{
			// Create New Item
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
						onchange: "inputChanged",
						style: "font-style:italic;border:0px;margin:0px;height:inherit;background-color:inherit;font-size:24px;padding:15px;"
					}
				]
			}
			]
		},
		//	========================================
		{
			// Display One User Item
			name: "userTodo",
			kind: "FittableRows",
			style: "width:548px;height:59px;margin:auto;background:white;border-bottom: 1px dotted #ccc;",
			onmouseover: "onMouseOver",
			onmouseout: "onMouseOut",
			components:
			[
			{
				kind: "FittableColumns",
				style: "height:100%;",

				components:
				[
					{
						content: '✔',
						name: "userTodoCheckmark",
						ontap: "itemComplete",
						style: "border-right: 1px solid red;visibility:hidden;font-size: 20px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;"
					},
					{
						name: "userTodoString",
						content: "",
						fit: true,
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
			}
			]
		}
		//	========================================



	],
	//	======================================
	create: function()
	{
		this.inherited(arguments);
	},
	rendered: function()
	{
		this.inherited(arguments);
	},
	inputChanged: function(inSender, inEvent) {
		this.$.userTodoString.setContent(inSender.getValue());

		this.$.userTodoString.addRemoveClass("task-now-complete", false);
		this.$.userTodoCheckmark.addRemoveClass("checkmark-now-complete", false);

		this.$.userTodoCheckmark.applyStyle("visibility", "visible");

		var nextTodo = this.createComponent
		({
			// Display User Item
			name: "userTodo" + inSender.getValue(),
			// name: "userTodo" + JSON.stringify(inSender.getValue()),
			kind: "FittableRows",

			onmouseover: "onMouseOver",
			onmouseout: "onMouseOut",

			style: "width:548px;height:59px;margin:auto;background:white;border-bottom: 1px dotted #ccc;",
			components:
			[
			{
				kind: "FittableColumns",
				style: "height:100%;",
				components:
				[
					{
						content: '✔',
						name: "userTodoCheckmark" + inSender.getValue(),
						ontap: "itemComplete",
						style: "border-right: 1px solid red;font-size: 20px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;"
					},
					{
						name: "userTodoString" + inSender.getValue(),
						content: inSender.getValue(),	// set value
						fit: true,
						classes: "task-format",
						style: "border:0px;margin:0px;height:inherit;background-color:inherit;padding:15px;"
					},
					{
						content: '✖',
						name: "userTodoDeleteMark" + inSender.getValue(),
						ontap: "itemDelete",
						style: "visibility:hidden;font-size: 22px;padding-top: 16px;width:50px;height:inherit;background-color:inherit;text-align:center;"
					}
				]
			}
			]
		});
		nextTodo.render();

		this.$.userInput.setValue("");	// clear input field

	},
	itemComplete: function(inSender, inEvent) {

		this.userTodoCompletionStatus = !this.userTodoCompletionStatus;		// toggle flag
		this.$.userTodoString.addRemoveClass("task-now-complete", this.userTodoCompletionStatus);
		this.$.userTodoCheckmark.addRemoveClass("checkmark-now-complete", this.userTodoCompletionStatus);

	},
	itemDelete: function(inSender, inEvent) {

		this.$.userTodoString.setContent("");
		this.$.userTodoCheckmark.addRemoveClass("checkmark-now-complete", false);
	},
	onMouseOver: function(inSender, inEvent) {

		enyo.log("onMouseOver: inSender.name = " + inSender.getName());

		// enyo.log("this = ", this);

		/*
		var objectName = "";

		if (inSender.getName() == "userTodo")
		{
			objectName = "userTodoDeleteMark";
		}
		else
		{
			objectName = "userTodoDeleteMark" + inSender.getName();
		}

		enyo.log("objectName = ", objectName);

		this.$.objectName.applyStyle("visibility", "visible");
		*/

		this.$.userTodoDeleteMark.applyStyle("visibility", "visible");

		return true;
	},
	onMouseOut: function(inSender, inEvent) {

		this.$.userTodoDeleteMark.applyStyle("visibility", "hidden");
		return true;
	}




});



