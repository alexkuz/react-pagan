import React, { Component } from 'react';
import FormattedText from 'react-hot!babel!./FormattedText';
import Highlight from 'react-highlight';

import componentSource from 'raw!./FormattedText';

const DEFAULT_FORMATS = {
  'en-US': ['{name|bold} took {numPhotos, plural,',
            '  =0 {no photos}',
            '  =1 {one photo}',
            '  other {# photos}',
            '} on {takenDate, date, long}.'].join('\n'),
  'ru-RU': ['{name|bold} {numPhotos, plural,' +
            '  =0 {не снял ни одной фотографии}',
            '  one {снял # фотографию}',
            '  few {снял # фотографии}',
            '  other {снял # фотографий}',
            '} {takenDate, date, long}'].join('\n')
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      i18n: { locales: 'en-US' },
      format: DEFAULT_FORMATS['en-US'],
      values:
`{
  "takenDate": ${new Date().getTime()},
  "numPhotos": 123,
  "name": "John Smith"
}`
    };
  }

  render() {
    let error = '', values = {};

    try {
      values = JSON.parse(this.state.values);
    } catch (err) {
      error = err.toString();
    }

    return (
      <div className='container'>
        <div className='page-header'>
          <div className='pull-right'>
            <select onChange={this.handleLocaleChange} className='form-control'>
              <option value='en-US'>en-US</option>
              <option value='ru-RU'>ru-RU</option>
            </select>
          </div>
          <h1>React-Pagan</h1>
        </div>
        <div className='row'>
          <div className='form-group col-xs-6'>
            <label>Format</label>
            <textarea onChange={this.handleFormatChange}
                      value={this.state.format}
                      className='form-control'
                      rows={this.state.format.split('\n').length} />
          </div>
          <div className='form-group col-xs-6'>
            <label>Values</label>
            <textarea onChange={this.handleValuesChange}
                      value={this.state.values}
                      className='form-control'
                      rows={this.state.values.split('\n').length} />
          </div>
        </div>
        {error &&
          <div className='alert alert-danger'>
            {error}
          </div>
        }
        <FormattedText text={this.state.format}
                       values={values}
                       i18n={this.state.i18n} />
        <h4>Source</h4>
        <Highlight className='javascript' style={{ margin: 0 }}>
          {componentSource}
        </Highlight>
      </div>
    );
  }

  handleFormatChange = e => {
    this.setState({ format: e.target.value });
  }

  handleValuesChange = e => {
    this.setState({ values: e.target.value });
  }

  handleLocaleChange = e => {
    this.setState({
      i18n: {
        ...this.state.i18n,
        locales: e.target.value
      },
      format: DEFAULT_FORMATS[e.target.value]
    });
  }
}
