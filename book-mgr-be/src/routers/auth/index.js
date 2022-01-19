const Router = require('@koa/router');

const mongoose = require('mongoose');

const { getBody } = require('../../helpers/utils')

const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const InviteCode = mongoose.model('InviteCode');


const router = new Router({
    prefix:'/auth'
});
// 注册
router.post('/register', async(ctx) => {
    const{
        account,
        password,
        inviteCode,
    } = getBody(ctx);

    if (account === '' || password === '' || inviteCode === ''){
        ctx.body = {
            code: 0,
            msg: '账号不能为空',
            data: null,    
        };

        return;
    }

    // 找有没有邀请码
    const findCode = await InviteCode.findOne({
        code: inviteCode,
    }).exec();

    if ( (!findCode) || findCode.user ){
        ctx.body = {
            code: 0,
            msg: '邀请码不正确',
            data: null, 
        };
        return;
    }

    // 找 account 为传递上来的“account”用户
    const findUser = await User.findOne({
        account,
    }).exec();

    if (findUser) {
        ctx.body = {
            code: 0,
            msg: '该用户已存在',
            data: null,    
        };
        return;
    }    

    const user = new User({
        account,
        password,
    });

    // 把创建的用户同步到mongodb
    const res = await user.save();

    findCode.user = res._id;
    findCode.meta.updatedAt = new Date().getTime();

    await findCode.save();

    ctx.body = {
        code: 1,
        msg: '注册成功',
        data: res,    
    };
});

// 登录
router.post('/login', async(ctx) => {
    const{
        account,
        password,
        
    } = getBody(ctx);

    if (account === '' || password === '' ){
        ctx.body = {
            code: 0,
            msg: '账号不能为空',
            data: null,    
        };

        return;
    }

    const findUser = await User.findOne({
        account,
    }).exec();

    if (!findUser) {
        ctx.body = {
            code: 0,
            msg: '用户名或密码错误',
            data: null, 
        };
        return;
    }

    const user = {
        account: one.account,
        _id: one._id,
    };

    if (one.password === password){
        ctx.body = {
            code: 1,
            msg: '登录成功',
            data: {
                user,
                token:jwt.sign(user, 'book-mgr'),

            }, 
        };
        return;

    }

    ctx.body = {
        code: 0,
        msg: '用户名或密码错误',
        data: null, 
    };
    return;
});

module.exports = router;


