/**
 * Testing
 * @ndaidong
 */

var sinon = require('sinon');

var checkCtxRender = (page, assert) => {
  let ctx = {
    session: {
      loggedIn: true
    },
    render: (layout, data, context) => {
      return {
        layout, data, context
      };
    }
  };

  let spy = sinon.spy(ctx, 'render');
  page(ctx);
  assert.ok(spy.calledOnce, `${page.name} must call ctx.render() once`);

  return spy.returnValues[0] || {};
};

module.exports = checkCtxRender;
