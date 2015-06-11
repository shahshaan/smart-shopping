var React = require('react');
var Eventful = require('eventful-react');
var CalendarComponent = require('react-widgets').Calendar
var Calendar = require('./Calendar.jsx');


var Tracker = Eventful.createClass({

  getInitialState: function() {
    var todaysDateInstance = new Date();
    var todaysDate = (todaysDateInstance.getMonth() + 1).toString() + '/' + todaysDateInstance.getDate().toString() + '/' + todaysDateInstance.getFullYear().toString();

    // firebase/groupme
    var groupMeGroupId = window.GROUP_ME_GROUP_ID_BE_ACTIVE;
    var firebaseUrl = window.FIREBASE_DB_ROOT + '/' + groupMeGroupId;
    console.log(firebaseUrl);
    var firebaseRef = new Firebase(firebaseUrl);
    return {
      dateClicked: todaysDate,
      groupMeToken: window.GROUP_ME_TOKEN_SHAAN,
      firebaseRef: firebaseRef,
      groupMeGroupId: groupMeGroupId,
      groupMeEventHashtags: window.GROUP_ME_BE_ACTIVE_EVENT_HASHTAGS
    };
  },
  componentDidMount: function() {
    this.on('dateClicked', function(data) {
      var dateInstance = data.dateInstance
      var dateClicked = (dateInstance.getMonth() + 1).toString() + '/' + dateInstance.getDate().toString() + '/' + dateInstance.getFullYear().toString();
      this.setState({
        dateClicked: dateClicked
      })
    });
    this.isNewestMessageIdInFirebase();
  },

  isNewestMessageIdInFirebase: function() {
    this.state.firebaseRef.child('newest_message_id').once("value", 
      function(snapshot) {
        var newest_message_id = snapshot.val();
        console.log('newest_message_id: ', newest_message_id)
      }, 
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
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