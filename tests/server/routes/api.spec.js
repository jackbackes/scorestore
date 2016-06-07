// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');
var dbURI = 'postgres://localhost:5432/testing-fsg';
var db = new Sequelize(dbURI, {
    logging: false
});
require('../../../server/db/models/user')(db);
var supertest = require('supertest');


describe('/api/v1', function() {
            var app, User;

            beforeEach('Sync DB', function() {
                return db.sync({
                    force: true
                });
            });

            beforeEach('Create app', function() {
                app = require('../../../server/app')(db);
                User = db.model('user');
            });

            describe('/user', function() {
                describe('POST', function() {
                    it('works', function() {
                        throw 'not working'
                    })
                })
                describe('/:id', function() {
                    describe('GET', function() {
                        it('works', function() {
                            throw 'not working'
                        })
                    })
                    describe('DELETE', function() {
                        it('works', function() {
                            throw 'not working'
                        })
                    })
                    describe('PUT', function() {
                        it('works', function() {
                            throw 'not working'
                        })
                    })
                })
            })
            describe('/users', function() {
                describe("GET", function() {
                    it('works', function() {
                        throw 'not working'
                    })
                })
                describe("?", function() {
                    it('works', function() {
                        throw 'not working'
                    })
                })
            })
            describe('/reviews', function() {
                        describe('GET', function() {
                            it('works', function() {
                                throw 'not working'
                            })
                        })
                        describe('?', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                        })
                        describe('/review', function() {
                        describe('POST', function() {
                            it('works', function() {
                                throw 'not working'
                            })
                        })
                        describe('/:id', function() {
                            describe('GET', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('DELETE', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('PUT', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                        })
                    })
                    describe('/composer', function() {
                        describe('POST', function() {
                            it('works', function() {
                                throw 'not working'
                            })
                        })
                        describe('/:id', function() {
                            describe('GET', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('DELETE', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('PUT', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                        })
                    })
                    describe('/composers', function() {
                            describe('GET', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('?', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                            })
                            describe('/order', function() {
                            describe('POST', function() {
                                it('works', function() {
                                    throw 'not working'
                                })
                            })
                            describe('/:id', function() {
                                describe('GET', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('DELETE', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('PUT', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                            })
                        })
                        describe('/orders', function() {
                                describe('GET', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('?', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                })
                                describe('/song', function() {
                                describe('POST', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('/:id', function() {
                                    describe('GET', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                    describe('DELETE', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                    describe('PUT', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                })
                            })
                            describe('/songs', function() {
                                describe('GET', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('?', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                })
                                describe('/genre', function() {
                                describe('POST', function() {
                                    it('works', function() {
                                        throw 'not working'
                                    })
                                })
                                describe('/:id', function() {
                                    describe('GET', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                    describe('DELETE', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                    describe('PUT', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                })
                            })
                            describe('/genres', function() {
                                    describe('GET', function() {
                                        it('works', function() {
                                            throw 'not working'
                                        })
                                    })
                                    describe('?', function() {
                                            it('works', function() {
                                                throw 'not working'
                                            })
                                        })
                                    })
                            })
