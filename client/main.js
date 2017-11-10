import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Accounts.ui.config({
  passwordSignupFields:"USERNAME_AND_EMAIL"
});

const Documents = new Mongo.Collection("documents");
const EditingUsers = new Mongo.Collection("editingUsers");

Template.editor.helpers({
	docid:function() {
		doc = Documents.findOne();
		if(doc) {
			return doc._id;
		}
	},
	config:function() {
		return function(editor) {
			editor.setOption('lineNumbers',true);
			editor.setOption('mode','html');
			editor.setOption('theme','cobalt');
			editor.on("change",function(cm_editor,info){
				$("#viewer_iframe")
					.contents()
					.find("html")
					.html(cm_editor.getValue());
				Meteor.call('addEditingUser');
			})
		}
	},
});

Template.editingUsers.helpers({
	users:function() {
		var doc, eusers, users;
		doc = Documents.findOne();
		if(!doc){return;}
		eusers = EditingUsers.findOne({docid:doc._id});
		if(!eusers){return;}
		users = new Array();
		var i = 0;
		for(var user_id in eusers.users) {
			users[i] = eusers.users[user_id];
			i++;
		}
		return users;
	}
});
