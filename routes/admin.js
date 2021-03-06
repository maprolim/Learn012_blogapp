const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

router.get('/', (req,res) => {
    res.render('admin/index')
})

router.get('/posts', (req,res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        console.log("Houve um erro ao listar as categorias: "+err)
        res.redirect('/admin')
    })
    
})
router.get('/categorias/add', (req,res) => {
    res.render('admin/addcategorias')
})
router.post('/categorias/nova', (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria é muito pequeno'})
    }
    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', "Categoria criada com sucesso!")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!")
            console.log("Houve um erro ao salvar a categoria: "+err)
            res.redirect('/admin/categorias')
        })
    }
})


router.get('/categorias/edit/:id', (req,res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        console.log("Erro: Esta categoria não existe: "+err)
        res.redirect('/admin/categorias')
    })
    
})
router.post('/categorias/edit', (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria é muito pequeno'})
    }
    if(erros.length > 0){
        res.render('admin/editcategorias', {erros: erros})
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorias')               
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a edição da categoria!')
                res.redirect('/admin/categorias')        
            })
    
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria!')
            console.log("Houve um erro ao editar a categoria: "+err)
            res.redirect('/admin/categorias')        
        })
    }
    // Categoria.findOne({_id: req.body.id}).then((categoria) => {

    //     categoria.nome = req.body.nome
    //     categoria.slug = req.body.slug

    //     categoria.save().then(() => {
    //         req.flash('success_msg', 'Categoria editada com sucesso!')
    //         res.redirect('/admin/categorias')               
    //     }).catch((err) => {
    //         req.flash('error_msg', 'Houve um erro ao salvar a edição da categoria!')
    //         res.redirect('/admin/categorias')        
    //     })

    // }).catch((err) => {
    //     req.flash('error_msg', 'Houve um erro ao editar a categoria!')
    //     res.redirect('/admin/categorias')        
    // })
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')     
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria!')
        console.log("Houve um erro ao deletar a categoria: "+err)
        res.redirect('/admin/categorias')        
    })
})

router.get('/postagens', (req,res) => {
    res.render('admin/postagens')
})
router.get('/postagens/add', (req,res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário!')
        console.log("Houve um erro ao carregar o formulário: "+err)
        res.redirect('/admin')
    })
})


router.post('/postagens/nova', (req,res) => {
    
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida: Registre uma categoria!"})
    }
    if(erros.length > 0){
        res.render('admin/addpostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash("error_msg", "Ouve um erro ao salvar a postagem: Tente novamente!")
            console.log("Ouve um erro ao salvar a postagem: "+err)
            res.redirect('/admin/postagens')
        })
    }
})

module.exports = router