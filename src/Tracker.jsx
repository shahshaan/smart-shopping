var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar
var Calendar = require('./Calendar.jsx');


var Tracker = Eventful.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    var todaysDateInstance = new Date();
    var todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();

    // firebase/groupme
    var groupMeGroupId = window.GROUP_ME_GROUP_ID_BE_ACTIVE;
    var firebaseUrl = window.FIREBASE_DB_ROOT + '/groupme-id-' + groupMeGroupId;
    var groupMeApiUrl = 'https://api.groupme.com/v3/groups/' + groupMeGroupId;
    var groupMeMessagesApiUrl = groupMeApiUrl + '/messages';
    var firebaseRef = new Firebase(firebaseUrl);
    return {
      dateClicked: todaysDate,
      groupMeToken: window.GROUP_ME_TOKEN_SHAAN,
      firebaseRef: firebaseRef,
      groupMeGroupId: groupMeGroupId,
      groupMeEventHashtags: window.GROUP_ME_BE_ACTIVE_EVENT_HASHTAGS,
      groupMeApiUrl: groupMeApiUrl,
      groupMeMessagesApiUrl: groupMeMessagesApiUrl,
      groupMeToken: window.GROUP_ME_TOKEN_SHAAN,
      firebaseUrl: firebaseUrl
    };
  },
  componentDidMount: function() {

    var ref = new Firebase(this.state.firebaseUrl + '/events');
    this.bindAsObject(ref, "events");

    this.on('dateClicked', function(data) {
      var dateInstance = data.dateInstance
      var dateClicked = (dateInstance.getMonth() + 1).toString() + '/' + dateInstance.getDate().toString() + '/' + dateInstance.getFullYear().toString();
      this.setState({
        dateClicked: dateClicked
      })
    });

    var addNewestMessagesFromGroupMeToFirebase = this.addNewestMessagesFromGroupMeToFirebase;
    var setFirstMessageIdAsFirstGroupMeMessageId = this.setFirstMessageIdAsFirstGroupMeMessageId;
    this.isNewestMessageIdInFirebase(function(isNewestMessageIdInFirebase) {
      if (isNewestMessageIdInFirebase) {
        addNewestMessagesFromGroupMeToFirebase();
      } else {
        setFirstMessageIdAsFirstGroupMeMessageId();
      };
    });

  },

  addWorkout: function(message) {
    var firebaseRef = this.state.firebaseRef
    var timeStamp = parseInt(message.created_at);
    var day = moment.unix(timeStamp).utc().format('L').split('/').join('-');
    console.log('date: ', day);
    console.log('workout to be added, ', message.text);
    var firebaseWorkoutDay = firebaseRef.child("events").child(day);
    firebaseWorkoutDay.push(message);
  },

  isWorkout: function(messageText) {
    var loggingTypes = this.state.groupMeEventHashtags;
    var hasLogger = false;
    if (messageText) {
      for (var i = 0; i < loggingTypes.length; i++) {
        var logType = loggingTypes[i];
        if (messageText.indexOf(logType) > -1) {
          hasLogger = true;
          break;
        };
      };
    };
    return hasLogger;
  },

  isNewestMessageIdInFirebase: function(callback) {
    var addNewestMessagesFromGroupMeToFirebase = this.addNewestMessagesFromGroupMeToFirebase;
    var setFirstMessageIdAsFirstGroupMeMessageId = this.setFirstMessageIdAsFirstGroupMeMessageId;

    this.state.firebaseRef.child('newest_message_id').once("value", 
      function(snapshot) {
        var newest_message_id = snapshot.val();
        if (newest_message_id) {
          callback(true);
        } else {
          callback(false);
        };
      }, 
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  },

  addNewestMessagesFromGroupMeToFirebase: function() {
    var groupMeToken = this.state.groupMeToken;
    var firebaseRef = this.state.firebaseRef;
    var groupMeMessagesApiUrl = this.state.groupMeMessagesApiUrl;
    var isWorkout = this.isWorkout;
    var addWorkout = this.addWorkout;
    var addNewestMessagesFromGroupMeToFirebase = this.addNewestMessagesFromGroupMeToFirebase;

    getNewestMessageIdFromFirebase = function(callback, callback2) { // 3

      firebaseRef.child('newest_message_id').once("value", 
        function(snapshot) {
          var newest_message_id = snapshot.val();
          callback(newest_message_id, callback2);
        }, 
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
    };

    getNewestMessagesFromGroupMe = function(afterId, callback) { // 1

      $.ajax({
          url: groupMeMessagesApiUrl,
          type:'get',
          data: {
            after_id: afterId,
            limit: 100,
            token: groupMeToken
          },
          success: function(response) {
            var messages = response.response.messages;
            callback(messages);
          },
          error: function(xhr) {
            console.log('Error in initial call for messages in setFirstMessageIdAsFirstGroupMeMessageId: ', xhr);
          }
      });
    };

    addMessagesGrabbedToFirebase = function(messages) {

      if (messages.length > 0) {
        var firebaseMessages = firebaseRef.child("messages");
        var messagesLength = messages.length;
        for (var i = 0; i < messagesLength; i++) {
          var message = messages[i];
          firebaseMessages.push(message);
          if (message.text && isWorkout(message.text)) {
            addWorkout(message);
          };
          if (i === (messagesLength - 1)) {
            var firebaseNewestMessageId = firebaseRef.child("newest_message_id");
            firebaseNewestMessageId.set(messages[messages.length - 1].id, function() { // set latest message id
              addNewestMessagesFromGroupMeToFirebase();
            });
          };
        };
      } 
    };

    getNewestMessageIdFromFirebase(function(afterId) {
      getNewestMessagesFromGroupMe(afterId, addMessagesGrabbedToFirebase);
    });

  },

  setFirstMessageIdAsFirstGroupMeMessageId: function() {

    var firebaseRefNewestMessageId = this.state.firebaseRef.child('newest_message_id');
    var firstMessageId = '';
    var groupMeMessagesApiUrl = this.state.groupMeMessagesApiUrl;
    var groupMeToken = this.state.groupMeToken;

    var recursiveGetMessagesBeforeId = function(lastMessageId) {

      $.ajax({
          url: groupMeMessagesApiUrl,
          type:'get',
          data: {
            limit: 100,
            before_id: lastMessageId,
            token: groupMeToken
          },
          success: function(response) {
            var messages = response.response.messages;
            var lastMessageId = messages[messages.length - 1].id;
            if (messages.length === 100) {
              recursiveGetMessagesBeforeId(lastMessageId)
            } else {
              var firstMessageId = lastMessageId;
              firebaseRefNewestMessageId.set(firstMessageId);
              console.log('First GroupMe message id was set to: ', firstMessageId);
              console.log('The first message in this GroupMe: ', messages[messages.length - 1]);
            } 
          },
          error: function(xhr) {
            console.log('Error in recursiveGetMessagesBeforeId call to GroupMe Messages: ', xhr);
          }
      });
    };

    $.ajax({
        url: groupMeMessagesApiUrl,
        type:'get',
        data: {
          limit: 100,
          token: this.state.groupMeToken
        },
        success: function(response) {
          var messages = response.response.messages;
          var lastMessageId = messages[messages.length - 1].id;
          recursiveGetMessagesBeforeId(lastMessageId);
        },
        error: function(xhr) {
          console.log('Error in initial call for messages in setFirstMessageIdAsFirstGroupMeMessageId: ', xhr);
        }
    });

  },

  // on load
    // if there is no newest message id
      // get it
      // once there is a new message id
        // call get addMessagesFromGroupMeToFirebase on an interval
          // itereate through all the messages newer than newest message id
            // push all new messages to messages in firebase
            // push all messages with an event to firebase events by date

  // set events to firebase events
  // set messages to firebase messages



  render: function() {
    window.dateClicked = this.state.dateClicked;
    window.events = this.state.events;
    console.log(window.events);
    return (
      <div class="row" id="tracker">
        <h1>Shopping Tracker</h1>
        <div className="col-md-6">
          <Calendar dateClicked={this.state.dateClicked} />
        </div>
        <div className="col-md-6 single-day">
          <div><h2>{this.state.dateClicked}</h2></div>
          <div className="logged-message">
            <div className="logged-message-title">
              Chris #shopped
            </div>
            <div className="logged-message-text">
              Bought laundry detergent, pizza, Curry jersey, and some shampoo for my beard #shopped
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Tracker;