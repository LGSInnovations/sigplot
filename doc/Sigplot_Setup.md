### Nodejs ###
`npm install --save git+ssh://git@gitlab.lgsinnovations.com:axios/sigplot#develop-2.0`

### Webpack ###

##### ES5 #####

`npm install --save script-loader`

```
require('!script-loader!lib/sigplot/sigplot-debug.js');
require('!script-loader!lib/sigplot/sigplot.plugins-debug.js');
```
##### ES6 #####
put this in the file you want to use Sigplot in
`import { Plot } from 'sigplot';`
### Browserify ###
Setup Browserify as normal follow the regular setup instructions


### React
After installing import sigplot using
`require('sigplot')`
You will need to create methods using [React Lifecycle](https://facebook.github.io/react/docs/react-component.html) events to reactify the class.
i.e.
```
import React, { Component, PropTypes } from 'react';
import { Plot } from 'sigplot';

export default class SigPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getChildContext() {
    return {
      plot: this.plot
    };
  }

  componentDidMount() {
    const {
      data,
      file,
      raster,
      options,
      xdelta,
      xunits,
      yunits,
      type,
      websocket,
    } = this.props;
    this.plot = new Plot(this.element, options);

    // Have to trigger context tree, setting state does that.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ plot: this.plot });
  }

  render() {
    const {
      height,
      width,
    } = this.props;
    const plot = this.plot;
    const children = plot ?
      React.Children.map(this.props.children, (child) => {
        if (child) {
          return React.cloneElement(child, { plot });
        }
        return null;
      }) : null;

    return (
      <div
        style={{ height, width, display: 'inline-block' }}
        ref={element => this.element = element}
      >
        { children }
      </div>);
  }
}

SigPlot.childContextTypes = {
  plot: PropTypes.instanceOf(Plot)
};

SigPlot.propTypes = {
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
  file: PropTypes.string,
  websocket: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number),
  raster: PropTypes.bool,
  options: PropTypes.object,
  type: PropTypes.number,
  xunits: PropTypes.number,
  yunits: PropTypes.number,
  xdelta: PropTypes.number
};

SigPlot.defaultProps = {
  height: 300,
  width: 300,
  type: 2000,
  xdelta: 1,
  xunits: 3, // Hz
  yunits: 26, // 10*log
  options: {
    all: true,
    expand: true,
    autol: 100,
    autohide_panbars: true
  }
};

```
This should allow you to treat the sigplot module as a react component.
