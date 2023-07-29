const MenuModel = require('../models/menu.model');
const UserModel = require('../models/user.model');
const AdminModel = require('../models/admin.model');
const multer = require('multer');
const DB = require('../utils/db');
const router = require('express').Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/items/')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
});
const upload = multer({ storage: storage });


const authMiddleware = (req, res, next) => {
    if (req.session.user && req.session.user.isLoggedIn)
        next()
    else
        res.redirect('/admin/login');
}

// Get admin 
router.get('/', async (req, res) => {
    try {
        if (req.session.user && req.session.user.isLoggedIn)
            res.redirect('/admin/dashboard');
        else
            res.redirect('/admin/login');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get admin login
router.get('/login', async (req, res) => {
    try {
        res.render('login', { title: 'Express', msg: '' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get admin logout
router.get('/logout', async (req, res) => {
    try {
        // destroy user session
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post admin login
router.post('/login', async (req, res) => {
    try {
        // create user session 
        const { email, password } = req.body;
        if (!email.trim() || !password.trim())
            return res.render('login', { msg: 'Invalid Credentials' });

        const user = await AdminModel.Login(email, password);
        if (!user)
            return res.render('login', { msg: 'Invalid Credentials' });

        req.session.user = {
            ...user,
            isLoggedIn: true
        };
        req.session.save();
        return res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get admin dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const totalUsers = (await UserModel.GetAllUsers()).length;
        const totalItems = (await MenuModel.GetAllItems()).length;
        return res.render('dashboard', { totalItems: totalItems, totalUsers: totalUsers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get all users 
router.get('/users', authMiddleware, async (req, res, next) => {
    try {
        const totalUsers = await UserModel.GetAllUsers();
        res.render('users', { totalUsers: totalUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get edit user 
router.get('/edit-user/:email', authMiddleware, async (req, res, next) => {
    try {
        const user = await UserModel.GetUser(req.params.email);
        res.render('editUser', { user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Post update user 
router.post('/user', authMiddleware, async (req, res, next) => {
    try {
        const id = req.body._id;
        let data = { ...req.body, _id: undefined, email: req.body.email.toLowerCase() }
        const user = await UserModel.Edit('Users', id, { ...data });
        return res.redirect('/admin/users');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get all items 
router.get('/items', authMiddleware, async (req, res, next) => {
    try {
        const totalItems = await MenuModel.GetAllItems();
        res.render('items', { totalItems: totalItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get edit item 
router.get('/edit-item/:id', authMiddleware, async (req, res, next) => {
    try {
        const item = await MenuModel.FindById(req.params.id);
        res.render('editItem', { item: item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


// Get new item 
router.get('/new-item', authMiddleware, async (req, res, next) => {
    try {
        res.render('newItem', {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Post update item
router.post('/new-item', authMiddleware, upload.single('image'), async (req, res, next) => {
    try {
        let data = { ...req.body }
        if (!data.image || !data.image.trim())
            delete data.image;
        if (req.file && req.file.filename)
            data = { ...data, image: 'items/' + req.file.filename };
        data = { ...data, id: await new DB().GetNextId('menu') }
        await MenuModel.AddMenuItem({ ...data })
        res.redirect('/admin/items');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Post update item
router.post('/item/:id', authMiddleware, upload.single('image'), async (req, res, next) => {
    try {
        let data = { ...req.body }
        if (!data.image || !data.image.trim())
            delete data.image;
        if (req.file && req.file.filename)
            data = { ...data, image: 'items/' + req.file.filename };
        await MenuModel.UpdateItemById(parseInt(req.params.id), { ...data });
        res.redirect('/admin/items');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get delete item 
router.get('/delete-item/:id', authMiddleware, async (req, res, next) => {
    try {
        const item = await MenuModel.DeleteMenuItem(req.params.id);
        res.redirect('/admin/items');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get change password page
router.get('/change-password', authMiddleware, async (req, res, next) => {
    try {
        res.render('changePassword', { msg: '', msgSuccess: '' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Post change password 
router.post('/change-password', authMiddleware, async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body;
        const session = { ...req.session.user };
        if (!currentPassword.trim() || !newPassword.trim())
            return res.render('changePassword', { msg: 'All fields are required', msgSuccess: '' });

        const result = await AdminModel.ChangePassword(session.user.email, currentPassword, newPassword)
        if (!result)
            return res.render('changePassword', { msgSuccess: '', msg: 'Admin not found' });

        return res.render('changePassword', { msgSuccess: 'Password changed successfully!', msg: '' });
    } catch (error) {
        console.log(error, '<<<<')
        res.status(500).json({ error: error.message });
    }
})





module.exports = router;