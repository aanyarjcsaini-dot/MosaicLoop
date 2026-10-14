// Product config for the Concern-based Product Finder.
// RULES: every field marked TODO-VERIFY must be checked against the official
// product page before production. Null = unknown; UI shows an honest fallback.
module.exports=[
{sku:'bb-rollon',brand:'Be Bodywise',name:'Underarm Roll-On',
concerns:['underarm-odour','underarm-darkness'], // TODO-VERIFY: confirm marketed concerns
keyIngredients:null, // TODO-VERIFY: confirm from official page
howToUse:null, // TODO-VERIFY
dailyDose:1,typicalResultWindowWeeks:null, // TODO-VERIFY
sourceUrl:'https://bebodywise.com/shop/body-care'},
{sku:'bb-bodywash',brand:'Be Bodywise',name:'Salicylic Acid Body Wash',
concerns:['body-acne','strawberry-skin'], // TODO-VERIFY
keyIngredients:[{name:'Salicylic acid',does:'TODO-VERIFY: confirm claimed action from official page',caution:'Patch-test first. General information, not medical advice.'}],
howToUse:null, // TODO-VERIFY
dailyDose:1,typicalResultWindowWeeks:null, // TODO-VERIFY
sourceUrl:'https://bebodywise.com/shop/body-care'},
{sku:'bb-shower',brand:'Be Bodywise',name:'Bodywash / Shower Gel',
concerns:[], // TODO-VERIFY: confirm which concerns this is marketed for
keyIngredients:null, // TODO-VERIFY
howToUse:null, // TODO-VERIFY
dailyDose:1,typicalResultWindowWeeks:null, // TODO-VERIFY
sourceUrl:'https://bebodywise.com/shop/body-care'},
{sku:'bb-dandruff',brand:'Be Bodywise',name:'Anti-Dandruff Shampoo',
concerns:['hair-scalp'], // TODO-VERIFY
keyIngredients:null, // TODO-VERIFY
howToUse:null, // TODO-VERIFY
dailyDose:null,typicalResultWindowWeeks:null, // TODO-VERIFY
sourceUrl:'https://bebodywise.com/shop/hair'},
{sku:'bb-biotin',brand:'Be Bodywise',name:'Biotin Hair Gummies',
concerns:['hair-scalp'], // TODO-VERIFY
keyIngredients:[{name:'Biotin',does:'B vitamin marketed for hair nutrition. General information, not medical advice.',caution:'Patch-test n/a (oral). If nursing, ask a professional.'},{name:'Zinc + B12 + D',does:'Marketed multivitamin support. General information, not medical advice.',caution:'Follow label dose.'}],
howToUse:'1 gummy daily after a meal',dailyDose:1,
typicalResultWindowWeeks:{min:12,max:24,source:'bebodywise.com product page (visible ~month 3, continue to month 6+)'},
sourceUrl:'https://bebodywise.com/product/hair-health-gummies'},
{sku:'mm-minox',brand:'Man Matters',name:'Minoxidil 5% Solution',
concerns:['hair-scalp'], // TODO-VERIFY
keyIngredients:null, // TODO-VERIFY
howToUse:null, // TODO-VERIFY
dailyDose:null,typicalResultWindowWeeks:null, // TODO-VERIFY
sourceUrl:'https://manmatters.com/shop/hair'}];
