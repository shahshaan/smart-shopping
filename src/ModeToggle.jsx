var React = require('react');
var Eventful = require('eventful-react');

var ModeToggle = Eventful.createClass({
  statics: {
    // modes enum
    SHOPPING: {},
    EDITING: {},
    CALENDAR: {}
  },
  getInitialState: function() {
    return {
      mode: ModeToggle.EDITING
    };
  },
  changeHandler: function(e) {
    var newMode = ModeToggle[e.target.value];
    this.setState({ mode: newMode });
    this.emit('change-mode', { mode: newMode })
  },
  render: function() {
    var buttonClasses = {
      shopping: 'btn btn-sm btn-white',
      editing: 'btn btn-sm btn-white',
      calendar: 'btn btn-sm btn-white'
    };
    if (this.state.mode === ModeToggle.SHOPPING) {
      buttonClasses.shopping += ' active';
    } else if (this.state.mode === ModeToggle.EDITING) {
      buttonClasses.editing += ' active';
    } else {
      buttonClasses.calendar += ' active';
    }

    return (
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div id="mode-toggle">
            <div className="ibox float-e-margins">
            <div data-toggle="buttons" className="btn-group" id="mode-toggle-buttons">
              <form onChange={this.changeHandler}>
                <label className={buttonClasses.shopping}>
                  <input type="radio" name="shopping" value="SHOPPING" checked={this.state.mode === ModeToggle.SHOPPING} onChange={this.changeHandler} />&nbsp;&nbsp;&nbsp;Shopping Mode
                </label>
                <label className={buttonClasses.editing}>
                  <input type="radio" name="editing" value="EDITING" checked={this.state.mode === ModeToggle.EDITING} onChange={this.changeHandler} />&nbsp;&nbsp;&nbsp;Editing Mode
                </label>
                <label className={buttonClasses.calendar}>
                  <input type="radio" name="calendar" value="CALENDAR" checked={this.state.mode === ModeToggle.CALENDAR} onChange={this.changeHandler} />&nbsp;&nbsp;&nbsp;Calendar Mode
                </label>
              </form>
            </div>
          </div>
            </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    );
  }
});

module.exports = ModeToggle;
