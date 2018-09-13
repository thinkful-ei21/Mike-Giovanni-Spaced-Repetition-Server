'use strict';

const cardArr = [
  {'imageUrls': [
    'https://imgc.allpostersimages.com/images/P-473-488-90/26/2677/THCUD00Z/posters/david-marshall-the-colosseum-rome-italy.jpg',
    'https://i0.wp.com/www.guggenheim.org/wp-content/uploads/2016/04/architecture-pgc-exterior-16-9-ratio-web.jpg',
    'https://www.italianme.it/wp-content/uploads/2016/11/Florence-monuments-2.jpg?x19310'
  ],
  'answer': 'Italy'},
  {'imageUrls': [
    'https://www.usnews.com/dims4/USNEWS/c42ff1c/2147483647/thumbnail/640x420/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2Fbc%2Feb%2Fad1b7d404905bf4e43dba72c45d5%2F170815-lincolnmemorial-editorial.jpg',
    'https://i.pinimg.com/originals/f9/29/30/f92930d29955a94a3fded558012fa040.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/Monument_Valley.jpg'
  ],
  'answer': 'USA'},
  {'imageUrls': [
    'https://chinesepeculiartraditions.files.wordpress.com/2013/12/2.jpg',
    'https://www.thehistoryhub.com/wp-content/uploads/2014/05/Great-Wall-of-China-Image.jpg',
    'https://2.bp.blogspot.com/-fj2EzuML_vs/UcdGdsPAaBI/AAAAAAAAKa8/C35Qpmrrb6k/s1600/tallest-statues-world-emperors-yan-huang-china+(3).jpg'
  ],
  'answer': 'China'},
  {'imageUrls': [
    'https://indianmonumentattractions.files.wordpress.com/2013/01/indian-monument-attractions-4-hawa-mahal.jpg',
    'https://marbleindian.files.wordpress.com/2014/08/taj-mahal-agra.jpg',
    'https://2.bp.blogspot.com/--0vVqraakRE/TxWkCKdXGxI/AAAAAAAABv8/e3LTEZ1qU-8/s1600/%2528India%2529+-+Hampi+-+Virupaksha+Temple+2.jpg'
  ],
  'answer': 'India'},
  {'imageUrls': [
    'https://c1.staticflickr.com/5/4111/4977032963_18d0dbcdc9_b.jpg',
    'https://2.bp.blogspot.com/-h7bNrmiohY8/U--QwkNz1NI/AAAAAAAAADQ/Tr0qajx_2RQ/s1600/La%2BTour%2BHassan%2BIn%2BMorocco%2B(2).jpg',
    'https://www.globeholidays.net/Africa/Morocco/Media/rabat_mausoleum.jpg'
  ],
  'answer': 'Morocco'},
  {'imageUrls': [
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/Monument_to_Alfonso_XII_of_Spain%2C_Madrid_-_general_view_1.JPG',
    'https://i2.wp.com/stay-u-nique.com/blog/wp-content/uploads/2016/10/sagrada-familia.png',
    'https://upload.wikimedia.org/wikipedia/commons/9/97/Alhambra_L%C3%B6wenhof_mit_L%C3%B6wenbrunnen_2014.jpg'
  ],
  'answer': 'Spain'},
  {'imageUrls': [
    'https://magical-steps.com/images/icerik/mod_tours/istanbul-blue-mosque-jpg1024_700_1jk0.jpg',
    'https://magical-steps.com/images/icerik/mod_tours/aspendos-tiyatro_700_1jk0.jpg',
    'https://3.bp.blogspot.com/-hRQ91bhKBy8/UVCnTv3sxeI/AAAAAAAB1QU/MZnnBmtob9k/s1600/Interior-of-the-Blue-Mosque-Sultan-Ahmed-Mosque-j318093130.jpg'
  ],
  'answer': 'Turkey'},
  {'imageUrls': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Vicu%C3%B1a_-_Chimborazo%2C_Ecuador.jpg/1280px-Vicu%C3%B1a_-_Chimborazo%2C_Ecuador.jpg',
    'https://trevorontour.files.wordpress.com/2012/11/dsc01049.jpg',
    'http://www.orangesmile.com/extreme/img/main/statue-of-virgin-mary-quito_1.jpg'
  ],
  'answer': 'Ecuador'},
  {'imageUrls': [
    'https://4.bp.blogspot.com/-1Y7PvWjQ1H8/UVVoRuDmK-I/AAAAAAAACrg/hiH2ufed6aE/s1600/Ayers+Rock+in+Uluru+National+Park2.jpg',
    'https://travelingcanucks.com/wp-content/uploads/2011/06/Sydney-Opera-House.jpg',
    'https://travelingcanucks.com/wp-content/uploads/2011/06/australian-war-memorial.jpg'
  ],
  'answer': 'Australia'},
  {'imageUrls': [
    'https://i.pinimg.com/736x/2f/dd/9b/2fdd9b5069423b6201a1825eeebd1a97.jpg',
    'https://blog.buckitdream.com/wp-content/uploads/2017/11/tokyo-mud-bath-bar-mudbath0716.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d4/Tokyo_tower_world_trade.jpg'
  ],
  'answer': 'Japan'}
];

// for (let c of cardArr){
//     console.log(c.answer);
// }

module.exports = {cardArr};