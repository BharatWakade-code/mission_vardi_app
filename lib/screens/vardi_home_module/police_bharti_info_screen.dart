import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:mission_vardi/utils/constants.dart';

class PoliceBhartiInfoScreen extends StatefulWidget {
  const PoliceBhartiInfoScreen({super.key});

  @override
  State<PoliceBhartiInfoScreen> createState() => _PoliceBhartiInfoScreenState();
}

class _PoliceBhartiInfoScreenState extends State<PoliceBhartiInfoScreen>
    with SingleTickerProviderStateMixin {
  int _selectedTabIndex = 0;
  final ScrollController _scrollController = ScrollController();
  
  // Custom syllabus search
  String _syllabusSearchQuery = "";
  final TextEditingController _syllabusSearchController = TextEditingController();

  final List<String> _tabs = [
    "संपूर्ण माहिती",
    "वयोमर्यादा व पगार",
    "निवड प्रक्रिया",
    "लेखी अभ्यासक्रम",
    "महत्वाच्या लिंक्स",
  ];

  final List<IconData> _tabIcons = [
    Icons.info_outline_rounded,
    Icons.monetization_on_outlined,
    Icons.assignment_turned_in_outlined,
    Icons.edit_note_rounded,
    Icons.link_rounded,
  ];

  Future<void> _openLink(String urlString) async {
    final Uri url = Uri.parse(urlString);
    try {
      if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("दुवा उघडता आला नाही: $urlString"),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("त्रुटी: $e"),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _syllabusSearchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor = isDark ? const Color(0xFF121212) : const Color(0xFFF6F8FC);
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryBlue = Constants.primaryBlueColour;
    final secondaryBlue = Constants.secondaryBlueColour;

    return Scaffold(
      backgroundColor: backgroundColor,
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // 🛡️ Premium Custom Slivers App Bar with Gradients
          SliverAppBar(
            expandedHeight: 180.0,
            floating: false,
            pinned: true,
            elevation: 0,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 16),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              title: Text(
                "पोलीस भरती माहिती केंद्र",
                style: GoogleFonts.philosopher(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  shadows: [
                    const Shadow(
                      offset: Offset(0, 2),
                      blurRadius: 4,
                      color: Colors.black45,
                    ),
                  ],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          primaryBlue,
                          secondaryBlue.withOpacity(0.9),
                          const Color(0xFF0F2027),
                        ],
                      ),
                    ),
                  ),
                  // Abstract decorative shapes for modern glassmorphism feeling
                  Positioned(
                    top: -50,
                    right: -50,
                    child: Container(
                      width: 180,
                      height: 180,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.06),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 20,
                    left: -30,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.04),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  // Uniform Shield Icon Overlay
                  Center(
                    child: Opacity(
                      opacity: 0.12,
                      child: Icon(
                        Icons.shield_rounded,
                        size: 140,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 🗂️ Horizontal Scrolling Segmented Tab Bar Selector
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverAppBarDelegate(
              minHeight: 64.0,
              maxHeight: 64.0,
              child: Container(
                color: backgroundColor,
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _tabs.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedTabIndex == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTabIndex = index;
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          gradient: isSelected
                              ? LinearGradient(
                                  colors: [primaryBlue, secondaryBlue],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                )
                              : null,
                          color: isSelected ? null : cardColor,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? Colors.transparent : Colors.grey.withOpacity(0.15),
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: primaryBlue.withOpacity(0.3),
                                    blurRadius: 8,
                                    offset: const Offset(0, 4),
                                  )
                                ]
                              : null,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _tabIcons[index],
                              size: 16,
                              color: isSelected ? Colors.white : Colors.grey.shade600,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _tabs[index],
                              style: commonTextStyle.copyWith(
                                fontSize: 13,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),

          // 📄 Active Section Body Rendering
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _buildActiveContent(cardColor, isDark, primaryBlue, secondaryBlue),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveContent(Color cardColor, bool isDark, Color primaryBlue, Color secondaryBlue) {
    switch (_selectedTabIndex) {
      case 0:
        return _buildCompleteInfo(cardColor, isDark, primaryBlue);
      case 1:
        return _buildAgeSalaryInfo(cardColor, isDark, primaryBlue);
      case 2:
        return _buildSelectionProcess(cardColor, isDark, primaryBlue);
      case 3:
        return _buildSyllabusSection(cardColor, isDark, primaryBlue);
      case 4:
        return _buildImportantLinks(cardColor, isDark, primaryBlue);
      default:
        return const SizedBox();
    }
  }

  // ==================== SECTION 1: संपूर्ण माहिती ====================
  Widget _buildCompleteInfo(Color cardColor, bool isDark, Color primaryBlue) {
    return Column(
      key: const ValueKey(0),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Welcome Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.02),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: primaryBlue.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.security_rounded, color: primaryBlue, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      "महाराष्ट्र पोलीस भरती",
                      style: GoogleFonts.philosopher(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                "महाराष्ट्र पोलीस दल हे देशातील सर्वात मोठ्या व शिस्तबद्ध पोलीस दलांपैकी एक आहे. राज्यातील कायदा व सुव्यवस्था राखणे, नागरिकांचे संरक्षण करणे, गुन्हेगारी नियंत्रणात ठेवणे आणि आपत्कालीन परिस्थितीत मदत करणे ही या दलाची प्रमुख जबाबदारी आहे. पोलीस दलात समाविष्ट होऊन देश आणि समाजाची सेवा करणे ही अत्यंत गौरवास्पद गोष्ट आहे.",
                style: commonTextStyle.copyWith(
                  fontSize: 14,
                  height: 1.6,
                  color: isDark ? Colors.white70 : Colors.black54,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Quick Facts Grid Section
        Text(
          "👮‍♂️ भरती ठळक वैशिष्ट्ये",
          style: GoogleFonts.philosopher(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          childAspectRatio: 1.45,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: [
            _buildFactCard("सध्या कार्यरत पोलीस", "२.२ – २.४ लाख", Icons.people_alt_rounded, Colors.blue),
            _buildFactCard("दरवर्षी भरल्या जागा", "३०,००० – ४५,०००", Icons.trending_up_rounded, Colors.green),
            _buildFactCard("विविध पदे", "१०+ पेक्षा जास्त", Icons.badge_rounded, Colors.orange),
            _buildFactCard("नोकरीचा प्रकार", "कायमस्वरूपी शासकीय", Icons.business_center_rounded, Colors.purple),
          ],
        ),
        const SizedBox(height: 24),

        // Why Join section
        Text(
          "💡 पोलीस भरतीमध्ये सहभागी का व्हावे?",
          style: GoogleFonts.philosopher(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        _buildAdvantageItem("अभिमान व प्रतिष्ठा", "महाराष्ट्र पोलीस दलात सामील होणे हा केवळ नोकरीचा प्रश्न नाही, तर राज्यसेवेचा आणि सन्मानाचा विषय आहे. पोलीस कर्मचारी समाजात विश्वास व न्यायाचे प्रतीक मानले जातात.", Icons.workspace_premium_rounded, Colors.amber),
        _buildAdvantageItem("उत्कृष्ट प्रशिक्षण व विकास", "निवडीनंतर शारीरिक, मानसिक व कायदेशीर प्रशिक्षण देऊन तुम्हाला एक शिस्तबद्ध आणि जबाबदार अधिकारी बनवले जाते.", Icons.fitness_center_rounded, Colors.blue),
        _buildAdvantageItem("गणवेशाचा मान", "पोलीस गणवेश हा अधिकार, प्रचंड जबाबदारी आणि समाजात अत्यंत सन्मानाचे प्रतीक आहे.", Icons.shield_outlined, Colors.red),
        _buildAdvantageItem("समाजाचे रक्षण व सेवा", "कायदा व सुव्यवस्था राखणे आणि आपत्तीच्या वेळी थेट मदत करणे यातून थेट देशसेवा घडते.", Icons.volunteer_activism_rounded, Colors.teal),
        _buildAdvantageItem("तंदुरुस्ती आणि व्यक्तिमत्व विकास", "पोलीस प्रशिक्षणामुळे शारीरिक तंदुरुस्ती व प्रचंड आत्मविश्वास मिळतो, जो आयुष्यभर उपयोगी ठरतो.", Icons.bolt_rounded, Colors.purple),
        _buildAdvantageItem("राज्यभर काम करण्याची संधी", "राज्यातील विविध जिल्हे व शहरांत काम करण्याचा समृद्ध आणि आव्हानात्मक अनुभव मिळतो.", Icons.map_rounded, Colors.indigo),
      ],
    );
  }

  Widget _buildFactCard(String title, String value, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const Spacer(),
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              )
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.philosopher(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: commonTextStyle.copyWith(
              fontSize: 10.5,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdvantageItem(String title, String desc, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.withOpacity(0.08)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 13.5,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: commonTextStyle.copyWith(
                    fontSize: 12,
                    height: 1.5,
                    color: isDark ? Colors.white70 : Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==================== SECTION 2: वयोमर्यादा व पगार ====================
  Widget _buildAgeSalaryInfo(Color cardColor, bool isDark, Color primaryBlue) {
    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Age Limit Section
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.calendar_month_rounded, color: Colors.orange, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    "📅 वयोमर्यादा (Age Limit)",
                    style: GoogleFonts.philosopher(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                ],
              ),
              const Divider(height: 24, thickness: 0.5),
              _buildBulletDetail("सामान्य प्रवर्ग (Open Category)", "१८ ते २८ वर्षे"),
              _buildBulletDetail("मागासवर्गीय प्रवर्ग (SC / ST / OBC / EWS)", "नियमानुसार ५ वर्षे शिथिलता (१८ ते ३३ वर्षे)"),
              _buildBulletDetail("विशेष सवलत प्रवर्ग", "माजी सैनिक, प्रकल्पग्रस्त, भूकंपग्रस्त व राष्ट्रीय खेळाडूंना शासन नियमानुसार विशेष वयोमर्यादा सवलत."),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Salary Section
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.monetization_on_rounded, color: Color(0xFF10B981), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    "💰 वेतन श्रेणी व भत्ते (Salary & Perks)",
                    style: GoogleFonts.philosopher(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                ],
              ),
              const Divider(height: 24, thickness: 0.5),
              _buildBulletDetail("वेतन श्रेणी", "७ वा वेतन आयोग लागू (अंदाजे सुरुवातीचा पगार रु. २८,०००/- ते ३५,०००/- प्रतिमहिना)"),
              _buildBulletDetail("शासकीय भत्ते", "महागाई भत्ता (DA), घरभाडे भत्ता (HRA), प्रवास भत्ता (TA), गणवेश भत्ता, धुलाई भत्ता व गृह विभागाचे विशेष भत्ते."),
              _buildBulletDetail("वैद्यकीय सुविधा व संरक्षण", "शासकीय नियमांनुसार मोफत किंवा सवलतीचे वैद्यकीय उपचार, विमा संरक्षण आणि निवृत्ती वेतन (NPS) सुविधा."),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBulletDetail(String title, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 5),
            child: Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: Colors.blueAccent,
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: isDark ? Colors.white70 : Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: commonTextStyle.copyWith(
                    fontSize: 12,
                    color: isDark ? Colors.grey.shade400 : Colors.black54,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  // ==================== SECTION 3: निवड प्रक्रिया ====================
  Widget _buildSelectionProcess(Color cardColor, bool isDark, Color primaryBlue) {
    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Timeline Title
        Text(
          "🎯 पोलीस भरती टप्प्याटप्प्याची निवड प्रक्रिया",
          style: GoogleFonts.philosopher(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        const SizedBox(height: 16),

        // Timeline Step 1: Physical Test
        _buildTimelineStep(
          stepNo: "१",
          title: "मैदानी चाचणी (Physical Test / PET)",
          badgeText: "५० गुण",
          badgeColor: Colors.deepOrange,
          details: [
            "👉 शारीरिक चाचणीत किमान २५ पेक्षा जास्त गुण (५०% गुण) मिळवल्यास उमेदवार लेखी परीक्षेस पात्र ठरतो.",
            "🚶 उंची मोजणी: पुरुष किमान १६५ से.मी. व महिला किमान १५५ से.मी. (पदानुसार बदल)",
            "📏 छाती मोजणी: पुरुष उमेदवारांसाठी न फुगवता ७९ से.मी. व फुगवून किमान ५ से.मी. जास्त.",
            "🏃 पुरुष चाचण्या: १६०० मीटर धावणे, १०० मीटर धावणे व गोळा फेक.",
            "🏃 महिला चाचण्या: ८०० मीटर धावणे, १०० मीटर धावणे व गोळा फेक.",
          ],
          icon: Icons.directions_run_rounded,
          cardColor: cardColor,
          isDark: isDark,
        ),

        // Timeline Step 2: Written Exam
        _buildTimelineStep(
          stepNo: "२",
          title: "लेखी परीक्षा (Written Exam)",
          badgeText: "१०० गुण",
          badgeColor: Colors.blueAccent,
          details: [
            "📝 परीक्षा बहुपर्यायी स्वरूपाची (MCQs) असून १.५ तास (९० मिनिटे) वेळ असतो.",
            "🚫 नकारात्मक गुण पद्धती (Negative Marking) नसते.",
            "📊 विषय: अंकगणित, बुद्धिमत्ता चाचणी, मराठी व्याकरण, सामान्य ज्ञान व चालू घडामोडी.",
            "👉 मैदानी चाचणीतील गुणांच्या गुणवत्ता यादीवर १:१० या प्रमाणात उमेदवारांची लेखी परीक्षेसाठी निवड होते.",
          ],
          icon: Icons.edit_document,
          cardColor: cardColor,
          isDark: isDark,
        ),

        // Timeline Step 3: DV & Medical
        _buildTimelineStep(
          stepNo: "३",
          title: "कागदपत्र पडताळणी व वैद्यकीय चाचणी",
          badgeText: "पात्रता",
          badgeColor: Colors.teal,
          details: [
            "🗂️ शैक्षणिक प्रमाणपत्रे, अधिवास प्रमाणपत्र (Domicile), जात प्रमाणपत्र व इतर मूळ कागदपत्रांची पडताळणी केली जाते.",
            "🏥 शारीरिक व मानसिकदृष्ट्या सक्षम असल्याची वैद्यकीय चाचणी घेतली जाते.",
            "🏆 अंतिम गुणवत्ता यादी = मैदानी चाचणी (५० गुण) + लेखी परीक्षा (१०० गुण) या दोन्हीतील गुणांच्या बेरजेवर आधारित ठरते.",
          ],
          icon: Icons.verified_user_rounded,
          cardColor: cardColor,
          isDark: isDark,
          isLast: true,
        ),
      ],
    );
  }

  Widget _buildTimelineStep({
    required String stepNo,
    required String title,
    required String badgeText,
    required Color badgeColor,
    required List<String> details,
    required IconData icon,
    required Color cardColor,
    required bool isDark,
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left timeline line & circle
        Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: badgeColor,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(color: badgeColor.withOpacity(0.3), blurRadius: 6, offset: const Offset(0, 3))
                ],
              ),
              child: Center(
                child: Text(
                  stepNo,
                  style: GoogleFonts.shareTechMono(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 240, // Static estimated line height
                color: badgeColor.withOpacity(0.3),
              ),
          ],
        ),
        const SizedBox(width: 16),

        // Right Detail Card
        Expanded(
          child: Container(
            margin: const EdgeInsets.only(bottom: 20),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.withOpacity(0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(icon, size: 20, color: badgeColor),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        title,
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13.5, color: isDark ? Colors.white : Colors.black87),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: badgeColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    badgeText,
                    style: commonTextStyle.copyWith(fontSize: 10, fontWeight: FontWeight.bold, color: badgeColor),
                  ),
                ),
                const Divider(height: 20, thickness: 0.5),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: details.map((item) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        item,
                        style: commonTextStyle.copyWith(fontSize: 11.5, height: 1.5, color: isDark ? Colors.white70 : Colors.black87),
                      ),
                    );
                  }).toList(),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ==================== SECTION 4: लेखी अभ्यासक्रम ====================
  Widget _buildSyllabusSection(Color cardColor, bool isDark, Color primaryBlue) {
    // Subject wise topics list
    final Map<String, List<String>> syllabusData = {
      "मराठी व्याकरण (२५ गुण)": [
        "मराठी वर्णमाला आणि मुळाक्षरे",
        "शब्दसंग्रह आणि समानार्थी/विरुद्धार्थी शब्द",
        "वाक्प्रचार आणि म्हणी (अर्थ व वाक्यात उपयोग)",
        "संधी व संधीचे प्रकार",
        "नाम, सर्वनाम, विशेषण, क्रियापद व त्यांचे प्रकार",
        "काळ व काळांचे प्रकार",
        "प्रयोग व प्रयोग विचार",
        "समास व समासाचे प्रकार",
        "वाक्यरचना व वाक्यांचे प्रकार",
        "शब्दसिद्धी (तत्सम, तद्भव, देशी इ.)"
      ],
      "अंकगणित (२५ गुण)": [
        "संख्या आणि संख्यांचे प्रकार",
        "पदावली, बेरीज, वजाबाकी, गुणाकार व भागाकार",
        "मसावि (HCF) आणि लसावि (LCM)",
        "दशांश अपूर्णांक व व्यवहारी अपूर्णांक",
        "वर्ग, वर्गमूळ, घन व घनमूळ",
        "सरासरी आणि शेकडेवारी",
        "नफा-तोटा व सूट",
        "गुणोत्तर व प्रमाण आणि भागीदारी",
        "काळ, काम, वेग आणि रेल्वेचे गणित",
        "वयवारी आणि सरळव्याज व चक्रवाढ व्याज",
        "भूमिती - क्षेत्रफळ, परिमिती व घनफळ"
      ],
      "बुद्धिमत्ता चाचणी (२५ गुण)": [
        "क्रमबद्ध मालिका (संख्या व अक्षर मालिका)",
        "सांकेतिक भाषा/लिपी (Coding-Decoding)",
        "दिशा आणि अंतर ओळखणे",
        "नातेसंबंध व रक्तसंबंधावर आधारित प्रश्न",
        "कालमापन (दिनदर्शिका व घड्याळ)",
        "वेन आकृती आणि वर्गीकरण (Odd one out)",
        "तार्किक प्रश्न आणि विधाने-अनुमाने",
        "प्रतिबिंब (आरशातील आणि पाण्यातील आकृती)",
        "आकृत्यांची मोजणी व जुळवणी"
      ],
      "सामान्य ज्ञान व चालू घडामोडी (२५ गुण)": [
        "इतिहास: भारताचा व महाराष्ट्राचा इतिहास, समाजसुधारक, भारतीय स्वातंत्र्य लढा",
        "भूगोल: महाराष्ट्राचा व भारताचा भूगोल, नद्या, पर्वत, राष्ट्रीय उद्याने",
        "राज्यघटना: भारतीय संविधान, मूलभूत हक्क, संसद, राज्यपाल, स्थानिक स्वराज्य संस्था",
        "सामान्य विज्ञान: भौतिकशास्त्र, रसायनशास्त्र, जीवशास्त्र व आरोग्यशास्त्र",
        "चालू घडामोडी: राष्ट्रीय व आंतरराष्ट्रीय घडामोडी, महत्त्वाचे पुरस्कार, क्रीडा क्षेत्र घडामोडी",
        "संगणक व माहिती तंत्रज्ञान: मूलभूत ज्ञान, संगणक प्रणाली व इंटरनेट",
        "सरकारी योजना व चालू घडामोडी"
      ]
    };

    final filteredData = <String, List<String>>{};
    syllabusData.forEach((key, list) {
      final matchedList = list.where((topic) {
        return topic.toLowerCase().contains(_syllabusSearchQuery.toLowerCase()) ||
            key.toLowerCase().contains(_syllabusSearchQuery.toLowerCase());
      }).toList();

      if (matchedList.isNotEmpty) {
        filteredData[key] = matchedList;
      }
    });

    return Column(
      key: const ValueKey(3),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Search bar for syllabus topics
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          height: 46,
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.withOpacity(0.15)),
          ),
          child: TextField(
            controller: _syllabusSearchController,
            onChanged: (val) {
              setState(() {
                _syllabusSearchQuery = val;
              });
            },
            decoration: InputDecoration(
              hintText: "अभ्यासक्रमातील टॉपिक शोधा...",
              hintStyle: commonTextStyle.copyWith(color: Colors.grey.shade500, fontSize: 12),
              prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Colors.blueAccent),
              suffixIcon: _syllabusSearchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        setState(() {
                          _syllabusSearchController.clear();
                          _syllabusSearchQuery = "";
                        });
                      },
                    )
                  : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
            style: commonTextStyle.copyWith(fontSize: 13, color: isDark ? Colors.white : Colors.black87),
          ),
        ),

        // Syllabus Subjects Expandable view
        if (filteredData.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 32),
              child: Column(
                children: [
                  Icon(Icons.search_off_rounded, size: 48, color: Colors.grey.shade400),
                  const SizedBox(height: 10),
                  Text(
                    "शोधलेले विषय आढळले नाहीत!",
                    style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
            ),
          )
        else
          ...filteredData.entries.map((entry) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.withOpacity(0.1)),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: primaryBlue.withOpacity(0.08),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.menu_book_rounded, color: primaryBlue, size: 18),
                  ),
                  title: Text(
                    entry.key,
                    style: commonTextStyle.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 13.5,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Divider(height: 1, thickness: 0.5),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: entry.value.map((topic) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(Icons.check_circle_outline_rounded, color: Colors.green, size: 16),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    topic,
                                    style: commonTextStyle.copyWith(
                                      fontSize: 12,
                                      height: 1.4,
                                      color: isDark ? Colors.white70 : Colors.black87,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    )
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  // ==================== SECTION 5: महत्वाच्या लिंक्स ====================
  Widget _buildImportantLinks(Color cardColor, bool isDark, Color primaryBlue) {
    return Column(
      key: const ValueKey(4),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Text(
          "🔗 महाराष्ट्र पोलीस भरती २०२६ : महत्वाच्या लिंक्स",
          style: GoogleFonts.philosopher(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          "थेट आणि अधिकृत वेबसाईट लिंक्स द्वारे अर्ज करा किंवा अधिक माहिती मिळवा.",
          style: commonTextStyle.copyWith(
            fontSize: 11.5,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 16),

        // Link Card 1
        _buildActionLinkCard(
          title: "माहितीपत्रक डाऊनलोड करा",
          desc: "पोलीस भरती २०२५ चे अधिकृत माहितीपत्रक पीडीएफ स्वरूपात डाऊनलोड करा.",
          btnText: "प्रॉस्पेक्टस डाऊनलोड",
          icon: Icons.picture_as_pdf_rounded,
          iconBg: Colors.red.shade50,
          iconColor: Colors.red,
          url: "https://mahapolicebharati.org/assets/images/POLICE%20BHARATI%202025_Prospectus%20%281%29.pdf",
          cardColor: cardColor,
          isDark: isDark,
        ),


        // Link Card 4
        _buildActionLinkCard(
          title: "अधिकृत शासकीय संकेतस्थळ",
          desc: "महाराष्ट्र राज्य पोलीस विभागाचे अधिकृत संकेतस्थळ : mahapolice.gov.in",
          btnText: "शासकीय संकेतस्थळाला भेट द्या",
          icon: Icons.gavel_rounded,
          iconBg: Colors.teal.shade50,
          iconColor: Colors.teal,
          url: "https://www.mahapolice.gov.in",
          cardColor: cardColor,
          isDark: isDark,
        ),
      ],
    );
  }

  Widget _buildActionLinkCard({
    required String title,
    required String desc,
    required String btnText,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String url,
    required Color cardColor,
    required bool isDark,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isDark ? iconColor.withOpacity(0.15) : iconBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: commonTextStyle.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 13.5,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      desc,
                      style: commonTextStyle.copyWith(
                        fontSize: 11,
                        color: isDark ? Colors.white70 : Colors.black54,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: isDark ? Colors.blue.shade900.withOpacity(0.4) : Constants.primaryBlueColour,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(vertical: 12),
                elevation: 0,
              ),
              icon: const Icon(Icons.launch_rounded, size: 16),
              label: Text(
                btnText,
                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 12.5, color: Colors.white),
              ),
              onPressed: () => _openLink(url),
            ),
          ),
        ],
      ),
    );
  }
}

// Helper class for sliver persistent tabbar
class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  final double minHeight;
  final double maxHeight;
  final Widget child;

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}
