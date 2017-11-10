import { Meteor } from 'meteor/meteor';

const Documents = new Mongo.Collection("documents");
const EditingUsers = new Mongo.Collection("editingUsers");

Meteor.startup(() => {
  // code to run on server at startup
  if(!Documents.findOne()) {
    Documents.insert({title:"My new documents"});
  }
});

Meteor.methods({
	addEditingUser: () => {
		var doc, user,eusers;
		doc = Documents.findOne();
		if(!doc){return;}
		if(!Meteor.user()){return;}
		eusers = EditingUsers.findOne({docid:doc._id});
		if(!eusers) {
			eusers = {
				docid: doc._id,
				users: {}
			};
		}
		user = Meteor.user();
		user.lastEdit = new Date();
		eusers.users[user._id] = user;
		EditingUsers.upsert({_id:eusers._id},eusers);
	}
})
