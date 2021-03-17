const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

//Notes
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ date: "desc" }).then(document => {
        const context = {
            notes: document.map(document => {
                return {
                    id: document._id,
                    title: document.title,
                    description: document.description
                }
            })
        }
        const name = req.user.name;
        res.render('notes/all-notes', { name, notes: context.notes })
    });
});

//Add Notes
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/add-note');
});

router.post('/notes/add', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Please write a title" });
    }
    if (!description) {
        errors.push({ text: "Please write a description" });
    }
    if (errors.length > 0) {
        res.render("notes/add-note", { errors, title, description });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success', 'Note Added Success');
        res.redirect('/notes');
    }
});

//Edit Notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    await Note.find({ _id: req.params.id }).then(document => {
        const context = {
            note: document.map(document => {
                return {
                    id: document._id,
                    title: document.title,
                    description: document.description
                }
            })
        }
        res.render('notes/edit-note', { note: context.note[0] });
    });
});

router.put('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    console.log(description);
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success', 'Note update success');
    res.redirect("/notes");
})

//Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success', 'Note delete success');
    res.redirect("/notes");
});


//functions
module.exports = router;