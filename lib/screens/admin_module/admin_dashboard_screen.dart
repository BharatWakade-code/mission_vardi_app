import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/screens/admin_module/admin_cubit.dart';
import 'package:edusaas/screens/admin_module/admin_state.dart';
import 'package:edusaas/utils/common_widgets/common_app_bar.dart';
import 'package:edusaas/utils/constants.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  // English Form Controllers
  final _titleCtrl = TextEditingController();
  final _categoryCtrl = TextEditingController();
  final _pdfCtrl = TextEditingController();
  final _contentCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _subjectCtrl = TextEditingController();
  final _typeCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();

  // Marathi Form Controllers
  final _titleMrCtrl = TextEditingController();
  final _descMrCtrl = TextEditingController();
  final _contentMrCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() {}); // to update FAB text
        _fetchCurrentTab();
      }
    });
    _fetchCurrentTab();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _fetchCurrentTab() {
    final cubit = context.read<AdminCubit>();
    switch (_tabController.index) {
      case 0: cubit.fetchItems('/notes'); break;
      case 1: cubit.fetchItems('/pyqs'); break;
      case 2: cubit.fetchItems('/quiz'); break;
      case 3: cubit.fetchItems('/notifications'); break;
    }
  }

  void _deleteItem(String id) {
    final cubit = context.read<AdminCubit>();
    switch (_tabController.index) {
      case 0: cubit.deleteItem('/notes/$id', '/notes'); break;
      case 1: cubit.deleteItem('/pyqs/$id', '/pyqs'); break;
      case 2: cubit.deleteItem('/quiz/$id', '/quiz'); break;
      case 3: cubit.deleteItem('/notifications/$id', '/notifications'); break;
    }
  }

  void _showCreateDialog(BuildContext context) {
    _titleCtrl.clear();
    _categoryCtrl.clear();
    _subjectCtrl.clear();
    _pdfCtrl.clear();
    _contentCtrl.clear();
    _descCtrl.clear();
    _typeCtrl.clear();
    _yearCtrl.clear();
    _titleMrCtrl.clear();
    _descMrCtrl.clear();
    _contentMrCtrl.clear();
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dContext) {
        return BlocBuilder<AdminCubit, AdminState>(
          builder: (context, state) {
            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Container(
                width: MediaQuery.of(context).size.width * 0.9,
                height: MediaQuery.of(context).size.height * 0.7,
                padding: const EdgeInsets.all(20),
                child: DefaultTabController(
                  length: 2,
                  child: Column(
                    children: [
                      Text(
                        "Create ${_getTabName()}",
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 15),
                      TabBar(
                        labelColor: Constants.primaryBlueColour,
                        unselectedLabelColor: Colors.grey,
                        indicatorColor: Constants.primaryBlueColour,
                        tabs:  [
                          Tab(text: 'english_input'.tr()),
                          Tab(text: 'marathi_input'.tr()),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Expanded(
                        child: TabBarView(
                          children: [
                            _buildEnglishForm(),
                            _buildMarathiForm(),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: state.isLoading ? null : () => Navigator.pop(dContext),
                            child: Text('cancel'.tr(), style: const TextStyle(color: Colors.grey)),
                          ),
                          const SizedBox(width: 10),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Constants.primaryBlueColour),
                            onPressed: state.isLoading ? null : () {
                              _submitForm();
                              Navigator.pop(dContext);
                            },
                            child: state.isLoading
                                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                : Text('create'.tr(), style: const TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _getTabName() {
    switch (_tabController.index) {
      case 0: return "Note";
      case 1: return 'pyq'.tr();
      case 2: return 'quiz'.tr();
      case 3: return "Notification";
      default: return "";
    }
  }

  Widget _buildEnglishForm() {
    return ListView(
      children: [
        _buildTextField(_titleCtrl, "Title (English)"),
        const SizedBox(height: 12),
        if (_tabController.index == 0) ...[
          _buildTextField(_descCtrl, "Description (Required)", maxLines: 2),
          const SizedBox(height: 12),
          _buildTextField(_categoryCtrl, "Category (e.g. 10th Class)"),
          const SizedBox(height: 12),
          _buildTextField(_subjectCtrl, "Subject (e.g. Mathematics)"),
          const SizedBox(height: 12),
          _buildTextField(_pdfCtrl, "PDF URL (Optional)"),
          const SizedBox(height: 12),
          _buildTextField(_contentCtrl, "Text Content (Optional)", maxLines: 5),
        ] else if (_tabController.index == 1) ...[
          _buildTextField(_yearCtrl, "Year (e.g. 2024)", isNumeric: true),
          const SizedBox(height: 12),
          _buildTextField(_categoryCtrl, "Category"),
          const SizedBox(height: 12),
          _buildTextField(_pdfCtrl, "PDF URL"),
        ] else if (_tabController.index == 2) ...[
          _buildTextField(_descCtrl, "Description (English)"),
          const SizedBox(height: 12),
          _buildTextField(_categoryCtrl, "Category"),
          const SizedBox(height: 12),
          _buildTextField(_typeCtrl, "Type (e.g., test, challenge)"),
          const SizedBox(height: 12),
          _buildTextField(_contentCtrl, 'Questions (Valid JSON Array)', maxLines: 5),
        ] else if (_tabController.index == 3) ...[
          _buildTextField(_descCtrl, "Body Content"),
          const SizedBox(height: 12),
          _buildTextField(_pdfCtrl, "Image URL (Optional)"),
        ]
      ],
    );
  }

  Widget _buildMarathiForm() {
    return ListView(
      children: [
        _buildTextField(_titleMrCtrl, "Title (Marathi)"),
        const SizedBox(height: 12),
        if (_tabController.index == 0) ...[
          _buildTextField(_descMrCtrl, "Description (Marathi)", maxLines: 2),
          const SizedBox(height: 12),
          _buildTextField(_contentMrCtrl, "Text Content (Marathi)", maxLines: 5),
        ] else if (_tabController.index == 2 || _tabController.index == 3) ...[
          _buildTextField(_descMrCtrl, "Description/Body (Marathi)", maxLines: 2),
        ]
      ],
    );
  }

  void _submitForm() {
    final cubit = context.read<AdminCubit>();
    if (_tabController.index == 0) {
      cubit.createNote(
        title: _titleCtrl.text,
        titleMr: _titleMrCtrl.text,
        description: _descCtrl.text.isEmpty ? "No description provided." : _descCtrl.text,
        descriptionMr: _descMrCtrl.text,
        category: _categoryCtrl.text,
        subject: _subjectCtrl.text,
        pdfUrl: _pdfCtrl.text,
        content: _contentCtrl.text,
        contentMr: _contentMrCtrl.text,
      );
    } else if (_tabController.index == 1) {
      cubit.createPYQ(
        title: _titleCtrl.text,
        titleMr: _titleMrCtrl.text,
        year: int.tryParse(_yearCtrl.text) ?? DateTime.now().year,
        category: _categoryCtrl.text,
        pdfUrl: _pdfCtrl.text,
      );
    } else if (_tabController.index == 2) {
      cubit.createQuiz(
        title: _titleCtrl.text,
        titleMr: _titleMrCtrl.text,
        description: _descCtrl.text,
        descriptionMr: _descMrCtrl.text,
        category: _categoryCtrl.text,
        type: _typeCtrl.text,
        jsonQuestions: _contentCtrl.text,
      );
    } else if (_tabController.index == 3) {
      cubit.createNotification(
        title: _titleCtrl.text,
        titleMr: _titleMrCtrl.text,
        body: _descCtrl.text,
        bodyMr: _descMrCtrl.text,
        imageUrl: _pdfCtrl.text,
      );
    }
  }

  Widget _buildTextField(TextEditingController ctrl, String hint, {int maxLines = 1, bool isNumeric = false}) {
    return TextField(
      controller: ctrl,
      maxLines: maxLines,
      keyboardType: isNumeric ? TextInputType.number : TextInputType.text,
      decoration: InputDecoration(
        labelText: hint,
        filled: true,
        fillColor: Colors.grey.shade100,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: 'admin_cms_dashboard'.tr(),
        titleIcon: Icons.admin_panel_settings,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreateDialog(context),
        backgroundColor: Constants.primaryBlueColour,
        icon: const Icon(Icons.add, color: Colors.white),
        label: Text("Create ${_getTabName()}", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              labelColor: Constants.primaryBlueColour,
              unselectedLabelColor: Colors.grey,
              indicatorColor: Constants.primaryBlueColour,
              indicatorWeight: 3,
              isScrollable: true,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              tabs: [
                Tab(icon: const Icon(Icons.menu_book), text: 'notes'.tr()),
                Tab(icon: const Icon(Icons.history_edu), text: 'pyqs'.tr()),
                Tab(icon: const Icon(Icons.quiz), text: 'quizzes'.tr()),
                Tab(icon: const Icon(Icons.notifications), text: 'notifs'.tr()),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: List.generate(4, (index) => _buildTabContent()),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabContent() {
    return BlocConsumer<AdminCubit, AdminState>(
      listener: (context, state) {
        if (state.message.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: state.isSuccess ? Colors.green : Colors.red,
            ),
          );
          context.read<AdminCubit>().clearMessage();
        }
      },
      builder: (context, state) {
        if (state.isLoading && state.items.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state.items.isEmpty) {
          return Center(
            child: Text(
              "No ${_getTabName()}s found. Create one!",
              style: TextStyle(fontFamily: 'Outfit', color: Colors.grey.shade500, fontSize: 18),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.items.length,
          itemBuilder: (context, index) {
            final item = state.items[index];
            final title = item['title'] ?? item['title_mr'] ?? 'Untitled';
            final category = item['category'] ?? item['type'] ?? item['body'] ?? '';
            final id = item['id'] ?? '';

            return Card(
              elevation: 2,
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: CircleAvatar(
                  backgroundColor: Constants.primaryBlueColour.withOpacity(0.1),
                  child: Icon(
                    _tabController.index == 0 ? Icons.menu_book :
                    _tabController.index == 1 ? Icons.history_edu :
                    _tabController.index == 2 ? Icons.quiz : Icons.notifications,
                    color: Constants.primaryBlueColour,
                  ),
                ),
                title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4.0),
                  child: Text(category, maxLines: 2, overflow: TextOverflow.ellipsis),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.red),
                  onPressed: () {
                    _showDeleteConfirm(context, id, title);
                  },
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showDeleteConfirm(BuildContext context, String id, String title) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('delete_item'.tr()),
        content: Text("Are you sure you want to delete '$title'? This cannot be undone."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text('cancel'.tr())),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              _deleteItem(id);
            },
            child: Text('delete'.tr(), style: const TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
