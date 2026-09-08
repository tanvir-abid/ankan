/*
 * Ankan Phonetic — type romanized Bangla (Banglish), get Bangla Unicode.
 *
 * The transliteration RULE DATA below (patterns/vowel/consonant/casesensitive)
 * is adapted from Avro Phonetic (OmicronLab / Rifat Nabi), the long-standing
 * open-source phonetic scheme used by Avro Keyboard, licensed under the
 * Mozilla Public License 1.1. Only the data table is reused; the parsing
 * engine and all input-attachment/UI code below are original.
 * https://github.com/omicronlab/Avro-Keyboard
 */

const PHONETIC_DATA = {
        "patterns":
        [
            {
                "find":"bhl",
                "replace":"ভ্ল"
            },
            {
                "find":"psh",
                "replace":"পশ"
            },
            {
                "find":"bdh",
                "replace":"ব্ধ"
            },
            {
                "find":"bj",
                "replace":"ব্জ"
            },
            {
                "find":"bd",
                "replace":"ব্দ"
            },
            {
                "find":"bb",
                "replace":"ব্ব"
            },
            {
                "find":"bl",
                "replace":"ব্ল"
            },
            {
                "find":"bh",
                "replace":"ভ"
            },
            {
                "find":"vl",
                "replace":"ভ্ল"
            },
            {
                "find":"b",
                "replace":"ব"
            },
            {
                "find":"v",
                "replace":"ভ"
            },
            {
                "find":"cNG",
                "replace":"চ্ঞ"
            },
            {
                "find":"cch",
                "replace":"চ্ছ"
            },
            {
                "find":"cc",
                "replace":"চ্চ"
            },
            {
                "find":"ch",
                "replace":"ছ"
            },
            {
                "find":"c",
                "replace":"চ"
            },
            {
                "find":"dhn",
                "replace":"ধ্ন"
            },
            {
                "find":"dhm",
                "replace":"ধ্ম"
            },
            {
                "find":"dgh",
                "replace":"দ্ঘ"
            },
            {
                "find":"ddh",
                "replace":"দ্ধ"
            },
            {
                "find":"dbh",
                "replace":"দ্ভ"
            },
            {
                "find":"dv",
                "replace":"দ্ভ"
            },
            {
                "find":"dm",
                "replace":"দ্ম"
            },
            {
                "find":"DD",
                "replace":"ড্ড"
            },
            {
                "find":"Dh",
                "replace":"ঢ"
            },
            {
                "find":"dh",
                "replace":"ধ"
            },
            {
                "find":"dg",
                "replace":"দ্গ"
            },
            {
                "find":"dd",
                "replace":"দ্দ"
            },
            {
                "find":"D",
                "replace":"ড"
            },
            {
                "find":"d",
                "replace":"দ"
            },
            {
                "find":"...",
                "replace":"..."
            },
            {
                "find":".`",
                "replace":"."
            },
            {
                "find":"..",
                "replace":"।।"
            },
            {
                "find":".",
                "replace":"।"
            },
            {
                "find":"ghn",
                "replace":"ঘ্ন"
            },
            {
                "find":"Ghn",
                "replace":"ঘ্ন"
            },
            {
                "find":"gdh",
                "replace":"গ্ধ"
            },
            {
                "find":"Gdh",
                "replace":"গ্ধ"
            },
            {
                "find":"gN",
                "replace":"গ্ণ"
            },
            {
                "find":"GN",
                "replace":"গ্ণ"
            },
            {
                "find":"gn",
                "replace":"গ্ন"
            },
            {
                "find":"Gn",
                "replace":"গ্ন"
            },
            {
                "find":"gm",
                "replace":"গ্ম"
            },
            {
                "find":"Gm",
                "replace":"গ্ম"
            },
            {
                "find":"gl",
                "replace":"গ্ল"
            },
            {
                "find":"Gl",
                "replace":"গ্ল"
            },
            {
                "find":"gg",
                "replace":"জ্ঞ"
            },
            {
                "find":"GG",
                "replace":"জ্ঞ"
            },
            {
                "find":"Gg",
                "replace":"জ্ঞ"
            },
            {
                "find":"gG",
                "replace":"জ্ঞ"
            },
            {
                "find":"gh",
                "replace":"ঘ"
            },
            {
                "find":"Gh",
                "replace":"ঘ"
            },
            {
                "find":"g",
                "replace":"গ"
            },
            {
                "find":"G",
                "replace":"গ"
            },
            {
                "find":"hN",
                "replace":"হ্ণ"
            },
            {
                "find":"hn",
                "replace":"হ্ন"
            },
            {
                "find":"hm",
                "replace":"হ্ম"
            },
            {
                "find":"hl",
                "replace":"হ্ল"
            },
            {
                "find":"h",
                "replace":"হ"
            },
            {
                "find":"jjh",
                "replace":"জ্ঝ"
            },
            {
                "find":"jNG",
                "replace":"জ্ঞ"
            },
            {
                "find":"jh",
                "replace":"ঝ"
            },
            {
                "find":"jj",
                "replace":"জ্জ"
            },
            {
                "find":"j",
                "replace":"জ"
            },
            {
                "find":"J",
                "replace":"জ"
            },
            {
                "find":"kkhN",
                "replace":"ক্ষ্ণ"
            },
            {
                "find":"kShN",
                "replace":"ক্ষ্ণ"
            },
            {
                "find":"kkhm",
                "replace":"ক্ষ্ম"
            },
            {
                "find":"kShm",
                "replace":"ক্ষ্ম"
            },
            {
                "find":"kxN",
                "replace":"ক্ষ্ণ"
            },
            {
                "find":"kxm",
                "replace":"ক্ষ্ম"
            },
            {
                "find":"kkh",
                "replace":"ক্ষ"
            },
            {
                "find":"kSh",
                "replace":"ক্ষ"
            },
            {
                "find":"ksh",
                "replace":"কশ"
            },
            {
                "find":"kx",
                "replace":"ক্ষ"
            },
            {
                "find":"kk",
                "replace":"ক্ক"
            },
            {
                "find":"kT",
                "replace":"ক্ট"
            },
            {
                "find":"kt",
                "replace":"ক্ত"
            },
            {
                "find":"kl",
                "replace":"ক্ল"
            },
            {
                "find":"ks",
                "replace":"ক্স"
            },
            {
                "find":"kh",
                "replace":"খ"
            },
            {
                "find":"k",
                "replace":"ক"
            },
            {
                "find":"lbh",
                "replace":"ল্ভ"
            },
            {
                "find":"ldh",
                "replace":"ল্ধ"
            },
            {
                "find":"lkh",
                "replace":"লখ"
            },
            {
                "find":"lgh",
                "replace":"লঘ"
            },
            {
                "find":"lph",
                "replace":"লফ"
            },
            {
                "find":"lk",
                "replace":"ল্ক"
            },
            {
                "find":"lg",
                "replace":"ল্গ"
            },
            {
                "find":"lT",
                "replace":"ল্ট"
            },
            {
                "find":"lD",
                "replace":"ল্ড"
            },
            {
                "find":"lp",
                "replace":"ল্প"
            },
            {
                "find":"lv",
                "replace":"ল্ভ"
            },
            {
                "find":"lm",
                "replace":"ল্ম"
            },
            {
                "find":"ll",
                "replace":"ল্ল"
            },
            {
                "find":"lb",
                "replace":"ল্ব"
            },
            {
                "find":"l",
                "replace":"ল"
            },
            {
                "find":"mth",
                "replace":"ম্থ"
            },
            {
                "find":"mph",
                "replace":"ম্ফ"
            },
            {
                "find":"mbh",
                "replace":"ম্ভ"
            },
            {
                "find":"mpl",
                "replace":"মপ্ল"
            },
            {
                "find":"mn",
                "replace":"ম্ন"
            },
            {
                "find":"mp",
                "replace":"ম্প"
            },
            {
                "find":"mv",
                "replace":"ম্ভ"
            },
            {
                "find":"mm",
                "replace":"ম্ম"
            },
            {
                "find":"ml",
                "replace":"ম্ল"
            },
            {
                "find":"mb",
                "replace":"ম্ব"
            },
            {
                "find":"mf",
                "replace":"ম্ফ"
            },
            {
                "find":"m",
                "replace":"ম"
            },
            {
                "find":"0",
                "replace":"০"
            },
            {
                "find":"1",
                "replace":"১"
            },
            {
                "find":"2",
                "replace":"২"
            },
            {
                "find":"3",
                "replace":"৩"
            },
            {
                "find":"4",
                "replace":"৪"
            },
            {
                "find":"5",
                "replace":"৫"
            },
            {
                "find":"6",
                "replace":"৬"
            },
            {
                "find":"7",
                "replace":"৭"
            },
            {
                "find":"8",
                "replace":"৮"
            },
            {
                "find":"9",
                "replace":"৯"
            },
            {
                "find":"NgkSh",
                "replace":"ঙ্ক্ষ"
            },
            {
                "find":"Ngkkh",
                "replace":"ঙ্ক্ষ"
            },
            {
                "find":"NGch",
                "replace":"ঞ্ছ"
            },
            {
                "find":"Nggh",
                "replace":"ঙ্ঘ"
            },
            {
                "find":"Ngkh",
                "replace":"ঙ্খ"
            },
            {
                "find":"NGjh",
                "replace":"ঞ্ঝ"
            },
            {
                "find":"ngOU",
                "replace":"ঙ্গৌ"
            },
            {
                "find":"ngOI",
                "replace":"ঙ্গৈ"
            },
            {
                "find":"Ngkx",
                "replace":"ঙ্ক্ষ"
            },
            {
                "find":"NGc",
                "replace":"ঞ্চ"
            },
            {
                "find":"nch",
                "replace":"ঞ্ছ"
            },
            {
                "find":"njh",
                "replace":"ঞ্ঝ"
            },
            {
                "find":"ngh",
                "replace":"ঙ্ঘ"
            },
            {
                "find":"Ngk",
                "replace":"ঙ্ক"
            },
            {
                "find":"Ngx",
                "replace":"ঙ্ষ"
            },
            {
                "find":"Ngg",
                "replace":"ঙ্গ"
            },
            {
                "find":"Ngm",
                "replace":"ঙ্ম"
            },
            {
                "find":"NGj",
                "replace":"ঞ্জ"
            },
            {
                "find":"ndh",
                "replace":"ন্ধ"
            },
            {
                "find":"nTh",
                "replace":"ন্ঠ"
            },
            {
                "find":"NTh",
                "replace":"ণ্ঠ"
            },
            {
                "find":"nth",
                "replace":"ন্থ"
            },
            {
                "find":"nkh",
                "replace":"ঙ্খ"
            },
            {
                "find":"ngo",
                "replace":"ঙ্গ"
            },
            {
                "find":"nga",
                "replace":"ঙ্গা"
            },
            {
                "find":"ngi",
                "replace":"ঙ্গি"
            },
            {
                "find":"ngI",
                "replace":"ঙ্গী"
            },
            {
                "find":"ngu",
                "replace":"ঙ্গু"
            },
            {
                "find":"ngU",
                "replace":"ঙ্গূ"
            },
            {
                "find":"nge",
                "replace":"ঙ্গে"
            },
            {
                "find":"ngO",
                "replace":"ঙ্গো"
            },
            {
                "find":"NDh",
                "replace":"ণ্ঢ"
            },
            {
                "find":"nsh",
                "replace":"নশ"
            },
            {
                "find":"Ngr",
                "replace":"ঙর"
            },
            {
                "find":"NGr",
                "replace":"ঞর"
            },
            {
                "find":"ngr",
                "replace":"ংর"
            },
            {
                "find":"nj",
                "replace":"ঞ্জ"
            },
            {
                "find":"Ng",
                "replace":"ঙ"
            },
            {
                "find":"NG",
                "replace":"ঞ"
            },
            {
                "find":"nk",
                "replace":"ঙ্ক"
            },
            {
                "find":"ng",
                "replace":"ং"
            },
            {
                "find":"nn",
                "replace":"ন্ন"
            },
            {
                "find":"NN",
                "replace":"ণ্ণ"
            },
            {
                "find":"Nn",
                "replace":"ণ্ন"
            },
            {
                "find":"nm",
                "replace":"ন্ম"
            },
            {
                "find":"Nm",
                "replace":"ণ্ম"
            },
            {
                "find":"nd",
                "replace":"ন্দ"
            },
            {
                "find":"nT",
                "replace":"ন্ট"
            },
            {
                "find":"NT",
                "replace":"ণ্ট"
            },
            {
                "find":"nD",
                "replace":"ন্ড"
            },
            {
                "find":"ND",
                "replace":"ণ্ড"
            },
            {
                "find":"nt",
                "replace":"ন্ত"
            },
            {
                "find":"ns",
                "replace":"ন্স"
            },
            {
                "find":"nc",
                "replace":"ঞ্চ"
            },
            {
                "find":"n",
                "replace":"ন"
            },
            {
                "find":"N",
                "replace":"ণ"
            },
            {
                "find":"OI`",
                "replace":"ৈ"
            },
            {
                "find":"OU`",
                "replace":"ৌ"
            },
            {
                "find":"O`",
                "replace":"ো"
            },
            {
                "find":"OI",
                "replace":"ৈ",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            }
                        ],
                        "replace":"ঐ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"ঐ"
                    }
                ]
            },
            {
                "find":"OU",
                "replace":"ৌ",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            }
                        ],
                        "replace":"ঔ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"ঔ"
                    }
                ]
            },
            {
                "find":"O",
                "replace":"ো",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            }
                        ],
                        "replace":"ও"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"ও"
                    }
                ]
            },
            {
                "find":"phl",
                "replace":"ফ্ল"
            },
            {
                "find":"pT",
                "replace":"প্ট"
            },
            {
                "find":"pt",
                "replace":"প্ত"
            },
            {
                "find":"pn",
                "replace":"প্ন"
            },
            {
                "find":"pp",
                "replace":"প্প"
            },
            {
                "find":"pl",
                "replace":"প্ল"
            },
            {
                "find":"ps",
                "replace":"প্স"
            },
            {
                "find":"ph",
                "replace":"ফ"
            },
            {
                "find":"fl",
                "replace":"ফ্ল"
            },
            {
                "find":"f",
                "replace":"ফ"
            },
            {
                "find":"p",
                "replace":"প"
            },
            {
                "find":"rri`",
                "replace":"ৃ"
            },
            {
                "find":"rri",
                "replace":"ৃ",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            }
                        ],
                        "replace":"ঋ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"ঋ"
                    }
                ]
            },
            {
                "find":"rrZ",
                "replace":"রর‍্য"
            },
            {
                "find":"rry",
                "replace":"রর‍্য"
            },
            {
                "find":"rZ",
                "replace":"র‍্য",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"r"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"y"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"w"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"x"
                            }
                        ],
                        "replace":"্র্য"
                    }
                ]
            },
            {
                "find":"ry",
                "replace":"র‍্য",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"r"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"y"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"w"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"x"
                            }
                        ],
                        "replace":"্র্য"
                    }
                ]
            },
            {
                "find":"rr",
                "replace":"রর",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!vowel"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"r"
                            },
                            {
                                "type":"suffix",
                                "scope":"!punctuation"
                            }
                        ],
                        "replace":"র্"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"r"
                            }
                        ],
                        "replace":"্রর"
                    }
                ]
            },
            {
                "find":"Rg",
                "replace":"ড়্গ"
            },
            {
                "find":"Rh",
                "replace":"ঢ়"
            },
            {
                "find":"R",
                "replace":"ড়"
            },
            {
                "find":"r",
                "replace":"র",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"r"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"y"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"w"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"x"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"Z"
                            }
                        ],
                        "replace":"্র"
                    }
                ]
            },
            {
                "find":"shch",
                "replace":"শ্ছ"
            },
            {
                "find":"ShTh",
                "replace":"ষ্ঠ"
            },
            {
                "find":"Shph",
                "replace":"ষ্ফ"
            },
            {
                "find":"Sch",
                "replace":"শ্ছ"
            },
            {
                "find":"skl",
                "replace":"স্ক্ল"
            },
            {
                "find":"skh",
                "replace":"স্খ"
            },
            {
                "find":"sth",
                "replace":"স্থ"
            },
            {
                "find":"sph",
                "replace":"স্ফ"
            },
            {
                "find":"shc",
                "replace":"শ্চ"
            },
            {
                "find":"sht",
                "replace":"শ্ত"
            },
            {
                "find":"shn",
                "replace":"শ্ন"
            },
            {
                "find":"shm",
                "replace":"শ্ম"
            },
            {
                "find":"shl",
                "replace":"শ্ল"
            },
            {
                "find":"Shk",
                "replace":"ষ্ক"
            },
            {
                "find":"ShT",
                "replace":"ষ্ট"
            },
            {
                "find":"ShN",
                "replace":"ষ্ণ"
            },
            {
                "find":"Shp",
                "replace":"ষ্প"
            },
            {
                "find":"Shf",
                "replace":"ষ্ফ"
            },
            {
                "find":"Shm",
                "replace":"ষ্ম"
            },
            {
                "find":"spl",
                "replace":"স্প্ল"
            },
            {
                "find":"sk",
                "replace":"স্ক"
            },
            {
                "find":"Sc",
                "replace":"শ্চ"
            },
            {
                "find":"sT",
                "replace":"স্ট"
            },
            {
                "find":"st",
                "replace":"স্ত"
            },
            {
                "find":"sn",
                "replace":"স্ন"
            },
            {
                "find":"sp",
                "replace":"স্প"
            },
            {
                "find":"sf",
                "replace":"স্ফ"
            },
            {
                "find":"sm",
                "replace":"স্ম"
            },
            {
                "find":"sl",
                "replace":"স্ল"
            },
            {
                "find":"sh",
                "replace":"শ"
            },
            {
                "find":"Sc",
                "replace":"শ্চ"
            },
            {
                "find":"St",
                "replace":"শ্ত"
            },
            {
                "find":"Sn",
                "replace":"শ্ন"
            },
            {
                "find":"Sm",
                "replace":"শ্ম"
            },
            {
                "find":"Sl",
                "replace":"শ্ল"
            },
            {
                "find":"Sh",
                "replace":"ষ"
            },
            {
                "find":"s",
                "replace":"স"
            },
            {
                "find":"S",
                "replace":"শ"
            },
            {
                "find":"oo`",
                "replace":"ু"
            },
            {
                "find":"oo",
                "replace":"ু",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"উ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"উ"
                    }
                ]
            },
            {
                "find":"o`",
                "replace":""
            },
            {
                "find":"oZ",
                "replace":"অ্য"
            },
            {
                "find":"o",
                "replace":"",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"vowel"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"o"
                            }
                        ],
                        "replace":"ও"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"vowel"
                            },
                            {
                                "type":"prefix",
                                "scope":"exact",
                                "value":"o"
                            }
                        ],
                        "replace":"অ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"অ"
                    }
                ]
            },
            {
                "find":"tth",
                "replace":"ত্থ"
            },
            {
                "find":"t``",
                "replace":"ৎ"
            },
            {
                "find":"TT",
                "replace":"ট্ট"
            },
            {
                "find":"Tm",
                "replace":"ট্ম"
            },
            {
                "find":"Th",
                "replace":"ঠ"
            },
            {
                "find":"tn",
                "replace":"ত্ন"
            },
            {
                "find":"tm",
                "replace":"ত্ম"
            },
            {
                "find":"th",
                "replace":"থ"
            },
            {
                "find":"tt",
                "replace":"ত্ত"
            },
            {
                "find":"T",
                "replace":"ট"
            },
            {
                "find":"t",
                "replace":"ত"
            },
            {
                "find":"aZ",
                "replace":"অ্যা"
            },
            {
                "find":"AZ",
                "replace":"অ্যা"
            },
            {
                "find":"a`",
                "replace":"া"
            },
            {
                "find":"A`",
                "replace":"া"
            },
            {
                "find":"a",
                "replace":"া",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"আ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!exact",
                                "value":"a"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"য়া"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"exact",
                                "value":"a"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"আ"
                    }
                ]
            },
            {
                "find":"i`",
                "replace":"ি"
            },
            {
                "find":"i",
                "replace":"ি",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ই"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ই"
                    }
                ]
            },
            {
                "find":"I`",
                "replace":"ী"
            },
            {
                "find":"I",
                "replace":"ী",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঈ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঈ"
                    }
                ]
            },
            {
                "find":"u`",
                "replace":"ু"
            },
            {
                "find":"u",
                "replace":"ু",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"উ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"উ"
                    }
                ]
            },
            {
                "find":"U`",
                "replace":"ূ"
            },
            {
                "find":"U",
                "replace":"ূ",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঊ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঊ"
                    }
                ]
            },
            {
                "find":"ee`",
                "replace":"ী"
            },
            {
                "find":"ee",
                "replace":"ী",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঈ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"ঈ"
                    }
                ]
            },
            {
                "find":"e`",
                "replace":"ে"
            },
            {
                "find":"e",
                "replace":"ে",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"এ"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"!exact",
                                "value":"`"
                            }
                        ],
                        "replace":"এ"
                    }
                ]
            },
            {
                "find":"z",
                "replace":"য"
            },
            {
                "find":"Z",
                "replace":"্য"
            },
            {
                "find":"y",
                "replace":"্য",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"!consonant"
                            },
                            {
                                "type":"prefix",
                                "scope":"!punctuation"
                            }
                        ],
                        "replace":"য়"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"ইয়"
                    }
                ]
            },
            {
                "find":"Y",
                "replace":"য়"
            },
            {
                "find":"q",
                "replace":"ক"
            },
            {
                "find":"w",
                "replace":"ও",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            },
                            {
                                "type":"suffix",
                                "scope":"vowel"
                            }
                        ],
                        "replace":"ওয়"
                    },
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"consonant"
                            }
                        ],
                        "replace":"্ব"
                    }
                ]
            },
            {
                "find":"x",
                "replace":"ক্স",
                "rules":
                [
                    {
                        "matches":
                        [
                            {
                                "type":"prefix",
                                "scope":"punctuation"
                            }
                        ],
                        "replace":"এক্স"
                    }
                ]
            },
            {
                "find":":`",
                "replace":":"
            },
            {
                "find":":",
                "replace":"ঃ"
            },
            {
                "find":"^`",
                "replace":"^"
            },
            {
                "find":"^",
                "replace":"ঁ"
            },
            {
                "find":",,",
                "replace":"্‌"
            },
            {
                "find":",",
                "replace":","
            },
            {
                "find":"$",
                "replace":"৳"
            },
            {
                "find":"`",
                "replace":""
            }
        ],
        "vowel":"aeiou",
        "consonant":"bcdfghjklmnpqrstvwxyz",
        "casesensitive":"oiudgjnrstyz"
};

function isVowel(c) {
  return PHONETIC_DATA.vowel.indexOf(c.toLowerCase()) >= 0;
}
function isConsonant(c) {
  return PHONETIC_DATA.consonant.indexOf(c.toLowerCase()) >= 0;
}
function isCaseSensitive(c) {
  return PHONETIC_DATA.casesensitive.indexOf(c.toLowerCase()) >= 0;
}
function isPunctuation(c) {
  return !(isVowel(c) || isConsonant(c));
}
function isExact(needle, haystack, start, end, not) {
  return !!((start >= 0 && end < haystack.length && haystack.substring(start, end) === needle) ^ not);
}

function fixString(input) {
  let fixed = '';
  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i);
    fixed += isCaseSensitive(c) ? c : c.toLowerCase();
  }
  return fixed;
}

/**
 * Convert a romanized ("Banglish") string into Bangla Unicode text using the
 * Avro phonetic rule set. Pure function, no DOM access.
 */
export function parsePhonetic(input) {
  const fixed = fixString(input);
  let output = '';
  for (let cur = 0; cur < fixed.length; cur++) {
    const start = cur;
    let end = cur + 1;
    let matched = false;

    for (let i = 0; i < PHONETIC_DATA.patterns.length; i++) {
      const pattern = PHONETIC_DATA.patterns[i];
      end = cur + pattern.find.length;
      if (end <= fixed.length && fixed.substring(start, end) === pattern.find) {
        const prev = start - 1;
        if (pattern.rules) {
          for (let j = 0; j < pattern.rules.length; j++) {
            const rule = pattern.rules[j];
            let replace = true;
            for (let k = 0; k < rule.matches.length; k++) {
              const match = rule.matches[k];
              const chk = match.type === 'suffix' ? end : prev;
              if (match.negative === undefined) {
                match.negative = false;
                if (match.scope.charAt(0) === '!') {
                  match.negative = true;
                  match.scope = match.scope.substring(1);
                }
              }
              if (match.value === undefined) match.value = '';

              if (match.scope === 'punctuation') {
                const ok = ((chk < 0 && match.type === 'prefix') ||
                  (chk >= fixed.length && match.type === 'suffix') ||
                  isPunctuation(fixed.charAt(chk))) ? true : false;
                if (!(ok ^ match.negative)) { replace = false; break; }
              } else if (match.scope === 'vowel') {
                const inRange = (chk >= 0 && match.type === 'prefix') || (chk < fixed.length && match.type === 'suffix');
                const ok = inRange && isVowel(fixed.charAt(chk));
                if (!(ok ^ match.negative)) { replace = false; break; }
              } else if (match.scope === 'consonant') {
                const inRange = (chk >= 0 && match.type === 'prefix') || (chk < fixed.length && match.type === 'suffix');
                const ok = inRange && isConsonant(fixed.charAt(chk));
                if (!(ok ^ match.negative)) { replace = false; break; }
              } else if (match.scope === 'exact') {
                let s, e;
                if (match.type === 'suffix') { s = end; e = end + match.value.length; }
                else { s = start - match.value.length; e = start; }
                if (!isExact(match.value, fixed, s, e, match.negative)) { replace = false; break; }
              }
            }
            if (replace) {
              output += rule.replace;
              cur = end - 1;
              matched = true;
              break;
            }
          }
        }
        if (matched) break;
        output += pattern.replace;
        cur = end - 1;
        matched = true;
        break;
      }
    }
    if (!matched) output += fixed.charAt(cur);
  }
  return output;
}

// ---------------------------------------------------------------------------
// Live input attachment: converts as you type, word by word, like Avro/Google
// Bangla phonetic input. Typing is buffered per element between "boundary"
// keys (space / enter); the buffer holds the raw, not-yet-converted Banglish
// text, and is re-parsed and re-rendered into the field on every keystroke.
// ---------------------------------------------------------------------------

const STATE = new WeakMap(); // el -> { buffer, start }

function toSelectorList(selector) {
  if (!selector) return [];
  if (Array.isArray(selector)) return selector.filter(Boolean);
  return String(selector).split(',').map(s => s.trim()).filter(Boolean);
}

function matchesTarget(el, selectors) {
  if (!el || el.nodeType !== 1) return false;
  if (selectors && selectors.length) {
    return selectors.some(sel => typeof el.matches === 'function' && el.matches(sel));
  }
  const tag = el.tagName;
  if (tag === 'TEXTAREA') return true;
  if (tag === 'INPUT') {
    const t = (el.type || 'text').toLowerCase();
    return ['text', 'search', 'url', 'email'].includes(t);
  }
  return false;
}

function resetState(el) {
  STATE.delete(el);
}

function getState(el) {
  let s = STATE.get(el);
  if (!s) { s = { buffer: '', start: null }; STATE.set(el, s); }
  return s;
}

function setRange(el, start, end) {
  if (el.setSelectionRange) el.setSelectionRange(start, end);
}

function replaceRange(el, start, end, text) {
  const v = el.value;
  el.value = v.slice(0, start) + text + v.slice(end);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

let matchSelectors = [];
let enabled = true;
let panel = null;

function shouldHandle(el) {
  return enabled && matchesTarget(el, matchSelectors);
}

function bufferInSync(el, st) {
  if (st.start === null) return true;
  if (st.start < 0 || st.start > el.value.length) return false;
  const expected = parsePhonetic(st.buffer);
  return el.value.slice(st.start, st.start + expected.length) === expected;
}

function handleBeforeInput(e) {
  const el = e.target;
  if (!shouldHandle(el)) return;
  if (typeof el.selectionStart !== 'number') return;
  if (!e.cancelable) return; // can't safely intercept (e.g. mid IME composition)

  const cursor = el.selectionStart;
  const selEnd = el.selectionEnd;
  const type = e.inputType;

  const st = getState(el);
  if (!bufferInSync(el, st)) resetState(el);
  const stFresh = getState(el);

  // A non-collapsed selection is being edited (user selected text and is
  // replacing/deleting it). That's outside what our per-word buffer can
  // safely track — let the browser do it natively and start fresh after.
  if (selEnd !== cursor) {
    resetState(el);
    return;
  }

  if (type === 'deleteContentBackward') {
    const currentRendered = stFresh.start !== null ? parsePhonetic(stFresh.buffer) : '';
    if (stFresh.buffer.length > 0 && stFresh.start !== null && cursor === stFresh.start + currentRendered.length) {
      e.preventDefault();
      stFresh.buffer = stFresh.buffer.slice(0, -1);
      const converted = parsePhonetic(stFresh.buffer);
      replaceRange(el, stFresh.start, stFresh.start + currentRendered.length, converted);
      setRange(el, stFresh.start + converted.length, stFresh.start + converted.length);
      if (stFresh.buffer.length === 0) resetState(el);
    } else {
      resetState(el);
    }
    return;
  }

  // Forward-delete, paste, formatting commands, etc: not part of our
  // buffered word, and not safe to guess at. Let the browser handle it.
  if (type !== 'insertText' && type !== 'insertLineBreak' && type !== 'insertParagraph'
    && type !== 'insertCompositionText' && type !== 'insertReplacementText') {
    resetState(el);
    return;
  }

  if (type === 'insertLineBreak' || type === 'insertParagraph') {
    e.preventDefault();
    replaceRange(el, cursor, cursor, '\n');
    setRange(el, cursor + 1, cursor + 1);
    resetState(el);
    return;
  }

  const data = e.data;
  if (!data) { resetState(el); return; }

  // Mobile keyboards can insert whole chunks at once (autocomplete taps,
  // predictive suggestions). Treat the whole chunk as one buffered update.
  e.preventDefault();
  if (stFresh.start === null) stFresh.start = cursor;
  const renderedLen = cursor - stFresh.start;

  if (data === ' ') {
    // Space finalizes the current word, then is inserted as itself.
    replaceRange(el, cursor, cursor, ' ');
    setRange(el, cursor + 1, cursor + 1);
    resetState(el);
    return;
  }

  stFresh.buffer += data;
  const converted = parsePhonetic(stFresh.buffer);
  replaceRange(el, stFresh.start, stFresh.start + renderedLen, converted);
  setRange(el, stFresh.start + converted.length, stFresh.start + converted.length);
}

function handleKeydownNav(e) {
  const el = e.target;
  if (!shouldHandle(el)) return;
  const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'PageUp', 'PageDown', 'Tab'];
  if (navKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
    resetState(el);
  }
}

const NATIVE_ATTRS = ['autocorrect', 'autocapitalize', 'spellcheck', 'autocomplete'];

function suppressNativeAssist(el) {
  if (el.dataset.ankanPhSuppressed) return;
  el.dataset.ankanPhSuppressed = '1';
  NATIVE_ATTRS.forEach(attr => {
    el.dataset['ankanPhOrig_' + attr] = el.hasAttribute(attr) ? el.getAttribute(attr) : '\u0000';
  });
  el.setAttribute('autocorrect', 'off');
  el.setAttribute('autocapitalize', 'off');
  el.setAttribute('autocomplete', 'off');
  el.spellcheck = false;
}

function restoreNativeAssist(el) {
  if (!el || !el.dataset || !el.dataset.ankanPhSuppressed) return;
  NATIVE_ATTRS.forEach(attr => {
    const key = 'ankanPhOrig_' + attr;
    const orig = el.dataset[key];
    if (orig === '\u0000') el.removeAttribute(attr);
    else if (orig !== undefined) el.setAttribute(attr, orig);
    delete el.dataset[key];
  });
  delete el.dataset.ankanPhSuppressed;
}

function handleFocusIn(e) {
  const el = e.target;
  if (shouldHandle(el)) suppressNativeAssist(el);
}

function handleFocusOut(e) {
  resetState(e.target);
  restoreNativeAssist(e.target);
}

function handleClickOrSelect(e) {
  // If the click/tap/selection change isn't part of active typing, drop the buffer.
  resetState(e.target);
}

function ensurePanel() {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.className = 'ankan-ph-badge';
  panel.innerHTML = `
    <span class="ankan-ph-dot"></span>
    <span class="ankan-ph-label">অঙ্কন ফোনেটিক</span>
    <span class="ankan-ph-info-wrap" tabindex="0">
      <button type="button" class="ankan-ph-info-btn" title="How to use">&#9432;</button>
      <div class="ankan-ph-info-panel">
        <strong>ব্যবহারবিধি</strong>
        <ul>
          <li>ইংরেজি বানানে টাইপ করুন, বাংলা লেখা হবে। যেমন: amar → আমার</li>
          <li>"ও"-কার পেতে বড় হাতের O লিখুন, যেমন: sOnar → সোনার</li>
          <li>দীর্ঘ স্বরের জন্য দুইবার লিখুন: aa → া, oo → ূ, ee → ী</li>
          <li>যতিচিহ্নের জন্য: . → । , $ → ৳ , : → ঃ</li>
          <li>স্পেস বা এন্টার দিলে শব্দটি চূড়ান্ত হয়ে যায়।</li>
        </ul>
      </div>
    </span>
  `;
  document.body.appendChild(panel);
  panel.querySelector('.ankan-ph-dot').addEventListener('click', () => {
    setPhoneticEnabled(!enabled);
  });
  return panel;
}

function updatePanel() {
  if (!panel) return;
  panel.classList.toggle('ankan-ph-off', !enabled);
}

/**
 * Attach live Banglish→Bangla phonetic conversion to matching inputs/textareas.
 * options:
 *  - selector / selectors: CSS selector(s) (string or array) for target fields.
 *  - enabled: boolean, start enabled or disabled (default true).
 *  - showBadge: boolean, whether to show the small floating on/off badge
 *    with the usage-info hover panel (default true).
 */
export function initPhoneticBangla(options = {}) {
  if (options.selector !== undefined || options.selectors !== undefined) {
    matchSelectors = toSelectorList(options.selector || options.selectors);
  }
  if (typeof options.enabled === 'boolean') enabled = options.enabled;

  if (options.showBadge !== false) ensurePanel();
  updatePanel();

  document.addEventListener('beforeinput', handleBeforeInput, true);
  document.addEventListener('keydown', handleKeydownNav);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);
  document.addEventListener('mouseup', handleClickOrSelect);
  document.addEventListener('touchend', handleClickOrSelect);
}

/** Turn phonetic conversion on/off globally without removing listeners. */
export function setPhoneticEnabled(isEnabled) {
  enabled = !!isEnabled;
  updatePanel();
}

export function isPhoneticEnabled() {
  return enabled;
}

/** Convert an entire existing string on demand (e.g. a "convert" button, or
 * fixing up text pasted before the listener was attached). */
/**
 * Returns the engine's own compound-letter (যুক্তাক্ষর) rules, straight from
 * the rule table — useful for building a reference/cheat-sheet UI. Each
 * entry is a direct, unconditional pattern whose output contains a hasant
 * (্), i.e. an actual consonant conjunct.
 */
export function getConjunctPatterns() {
  return PHONETIC_DATA.patterns
    .filter(p => !p.rules && p.replace && p.replace.includes('\u09cd'))
    .map(p => ({ pattern: p.find, output: p.replace }));
}

export function convertText(raw) {
  return parsePhonetic(raw);
}