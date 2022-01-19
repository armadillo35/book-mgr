import  { defineComponent, reactive, ref } from 'vue'
import  { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { auth } from '@/service'
import { result } from '@/helpers/utils'
import { message } from 'ant-design-vue'


export default defineComponent({
    components:{
        UserOutlined,
        LockOutlined,
        MailOutlined,
    },
    
    setup(){
        // 注册用的表单数据
        const regForm = reactive({
            account:'',
            password:'',
            inviteCode:'',
        });
        // 注册逻辑
        const register = async ()=>{
            if (regForm.account === ''){
                message.info('账号不能为空');
                return;
            };

            if (regForm.password === ''){
                message.info('密码不能为空');
                return;
            }

            if (regForm.inviteCode === ''){
                message.info('邀请码不能为空');
                return;
            }
            
            const res = await auth.register(regForm.account, regForm.password,regForm.inviteCode);

            result(res)
            .success((data) => {
                message.success(data.msg);
            });
        };

        const loginForm = reactive({
            account:'',
            password:'',
        });

        const login = async ()=>{
            if (loginForm.account === ''){
                message.info('账号不能为空');
                return;
            };

            if (loginForm.password === ''){
                message.info('密码不能为空');
                return;
            };

            const res = await auth.login(loginForm.account, loginForm.password);
            
            result(res)
            .success((data) => {
                message.success(data.msg);
            });
        }

        return {
        // 注册相关的数据
            regForm,
            register,
        // 登录相关的数据
            loginForm,
            login,
        };

    },   
});