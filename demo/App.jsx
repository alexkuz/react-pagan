import React, { Component } from 'react';
import MessageExample from './MessageExample';
import { connect } from 'react-redux';
import componentSource from '!!raw!./MessageExample';
import { loadLang } from 'redux-pagan';
import cookie from 'cookie.js';
import Source from './Source';

function getLangData(locale) {
  return require('./i18n/' + locale + '.i18n.json');
}

const DEFAULT_VALUES = [
  '{',
  `  "takenDate": ${new Date().getTime()},`,
  '  "numPhotos": 123,',
  '  "name": "John Smith"',
  '}'
].join('\n');

@connect(state => ({
  lang: state.i18n.get('app'),
  locale: state.i18n.locale
}))
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: props.lang('text').s,
      values: DEFAULT_VALUES
    };
  }

  componentDidMount() {
    this.props.dispatch(loadLang(cookie.get('lang') || 'en-US', getLangData));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      cookie.set('lang', nextProps.locale);
      this.setState({ format: nextProps.lang('text') });
    }
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
            <select onChange={this.handleLocaleChange}
                    className='form-control'
                    value={this.props.locale}>
              <option value='en-US'>en-US</option>
              <option value='ru-RU'>ru-RU</option>
              <option value='fi-FI'>fi-FI</option>
            </select>
          </div>
          <h1>React-Pagan</h1>
        </div>
        <div className='row'>
          <div className='form-group col-xs-6'>
            <label>Format</label>
            <textarea onChange={this.handleFormatChange}
                      value={this.state.format.s}
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
        <MessageExample message={this.state.format}
                        values={values}
                        locale={this.props.locale}
                        lang={this.props.lang} />
        <h4>Source</h4>
        <Source text={componentSource} />
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
    this.props.dispatch(loadLang(e.target.value, getLangData));
  }
}
