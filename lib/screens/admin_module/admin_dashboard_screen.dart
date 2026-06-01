import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/screens/admin_module/admin_cubit.dart';
import 'package:mission_vardi/screens/admin_module/admin_state.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedIndex = 0;

  // Form Controllers
  final _titleCtrl = TextEditingController();
  final _categoryCtrl = TextEditingController();
  final _pdfCtrl = TextEditingController();
  final _contentCtrl = TextEditingController();
  final _descCtrl = TextEditingController(); // For Note desc / Quiz desc / Notif body
  final _typeCtrl = TextEditingController(); // For Quiz type
  final _yearCtrl = TextEditingController(); // For PYQ year

  @override
  void initState() {
    super.initState();
    _fetchCurrentTab();
  }

  void _fetchCurrentTab() {
    final cubit = context.read<AdminCubit>();
    switch (_selectedIndex) {
      case 0:
        cubit.fetchItems('/notes');
        break;
      case 1:
        cubit.fetchItems('/pyqs');
        break;
      case 2:
        cubit.fetchItems('/quiz');
        break;
      case 3:
        cubit.fetchItems('/notifications');
        break;
    }
  }

  void _deleteItem(String id) {
    final cubit = context.read<AdminCubit>();
    switch (_selectedIndex) {
      case 0:
        cubit.deleteItem('/notes/$id', '/notes');
        break;
      case 1:
        cubit.deleteItem('/pyqs/$id', '/pyqs');
        break;
      case 2:
        cubit.deleteItem('/quiz/$id', '/quiz');
        break;
      case 3:
        cubit.deleteItem('/notifications/$id', '/notifications');
        break;
    }
  }

  void _showCreateDialog(BuildContext context) {
    _titleCtrl.clear();
    _categoryCtrl.clear();
    _pdfCtrl.clear();
    _contentCtrl.clear();
    _descCtrl.clear();
    _typeCtrl.clear();
    _yearCtrl.clear();
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dContext) {
        return BlocBuilder<AdminCubit, AdminState>(
          builder: (context, state) {
            return AlertDialog(
              title: Text("Create ${_getTabName()}"),
              content: SingleChildScrollView(
                child: SizedBox(
                  width: double.maxFinite,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: _buildFormFields(),
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: state.isLoading ? null : () => Navigator.pop(dContext),
                  child: const Text("Cancel", style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Constants.primaryBlueColour),
                  onPressed: state.isLoading ? null : () {
                    _submitForm();
                    Navigator.pop(dContext);
                  },
                  child: state.isLoading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text("Create", style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  String _getTabName() {
    switch (_selectedIndex) {
      case 0: return "Note";
      case 1: return "PYQ";
      case 2: return "Quiz";
      case 3: return "Notification";
      default: return "";
    }
  }

  List<Widget> _buildFormFields() {
    List<Widget> fields = [];
    
    // Title is common
    fields.add(_buildTextField(_titleCtrl, "Title"));
    fields.add(const SizedBox(height: 12));

    if (_selectedIndex == 0) {
      // Notes
      fields.add(_buildTextField(_descCtrl, "Description (Required)", maxLines: 2));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_categoryCtrl, "Category"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_pdfCtrl, "PDF URL (Optional)"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_contentCtrl, "Text Content (Optional)", maxLines: 5));
    } else if (_selectedIndex == 1) {
      // PYQs
      fields.add(_buildTextField(_yearCtrl, "Year (e.g. 2024)", isNumeric: true));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_categoryCtrl, "Category"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_pdfCtrl, "PDF URL"));
    } else if (_selectedIndex == 2) {
      // Quiz
      fields.add(_buildTextField(_descCtrl, "Description"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_categoryCtrl, "Category"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_typeCtrl, "Type (e.g., test, challenge)"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_contentCtrl, 'Questions (Valid JSON Array)', maxLines: 5));
    } else if (_selectedIndex == 3) {
      // Notification
      fields.add(_buildTextField(_descCtrl, "Body Content"));
      fields.add(const SizedBox(height: 12));
      fields.add(_buildTextField(_pdfCtrl, "Image URL (Optional)"));
    }

    return fields;
  }

  void _submitForm() {
    final cubit = context.read<AdminCubit>();
    if (_selectedIndex == 0) {
      cubit.createNote(
        title: _titleCtrl.text,
        description: _descCtrl.text.isEmpty ? "No description provided." : _descCtrl.text,
        category: _categoryCtrl.text,
        pdfUrl: _pdfCtrl.text,
        content: _contentCtrl.text,
      );
    } else if (_selectedIndex == 1) {
      cubit.createPYQ(
        title: _titleCtrl.text,
        year: int.tryParse(_yearCtrl.text) ?? DateTime.now().year,
        category: _categoryCtrl.text,
        pdfUrl: _pdfCtrl.text,
      );
    } else if (_selectedIndex == 2) {
      cubit.createQuiz(
        title: _titleCtrl.text,
        description: _descCtrl.text,
        category: _categoryCtrl.text,
        type: _typeCtrl.text,
        jsonQuestions: _contentCtrl.text,
      );
    } else if (_selectedIndex == 3) {
      cubit.createNotification(
        title: _titleCtrl.text,
        body: _descCtrl.text,
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
        titleText: "Admin CMS Dashboard",
        titleIcon: Icons.admin_panel_settings,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreateDialog(context),
        backgroundColor: Colors.indigo,
        icon: const Icon(Icons.add, color: Colors.white),
        label: Text("Create ${_getTabName()}", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Row(
        children: [
          // Sidebar
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              if (_selectedIndex != index) {
                setState(() => _selectedIndex = index);
                _fetchCurrentTab();
              }
            },
            labelType: NavigationRailLabelType.all,
            backgroundColor: Colors.white,
            selectedIconTheme: const IconThemeData(color: Colors.indigo),
            unselectedIconTheme: IconThemeData(color: Colors.grey.shade600),
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.menu_book_outlined),
                selectedIcon: Icon(Icons.menu_book),
                label: Text('Notes'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.history_edu_outlined),
                selectedIcon: Icon(Icons.history_edu),
                label: Text('PYQs'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.quiz_outlined),
                selectedIcon: Icon(Icons.quiz),
                label: Text('Quizzes'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.notifications_outlined),
                selectedIcon: Icon(Icons.notifications),
                label: Text('Notifs'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // Main Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: BlocConsumer<AdminCubit, AdminState>(
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
                    itemCount: state.items.length,
                    itemBuilder: (context, index) {
                      final item = state.items[index];
                      final title = item['title'] ?? 'Untitled';
                      final category = item['category'] ?? item['type'] ?? item['body'] ?? '';
                      final id = item['id'] ?? '';

                      return Card(
                        elevation: 1,
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: CircleAvatar(
                            backgroundColor: Colors.indigo.withOpacity(0.1),
                            child: Icon(
                              _selectedIndex == 0 ? Icons.menu_book :
                              _selectedIndex == 1 ? Icons.history_edu :
                              _selectedIndex == 2 ? Icons.quiz : Icons.notifications,
                              color: Colors.indigo,
                            ),
                          ),
                          title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text(category, maxLines: 2, overflow: TextOverflow.ellipsis),
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
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirm(BuildContext context, String id, String title) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Delete Item"),
        content: Text("Are you sure you want to delete '$title'? This cannot be undone."),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              _deleteItem(id);
            },
            child: const Text("Delete", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
