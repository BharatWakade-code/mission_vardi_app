import 'package:flutter/material.dart';

class CommonScrollablePagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final ValueChanged<int> onPageSelected;

  const CommonScrollablePagination({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.onPageSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 45,
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: currentPage > 0
                ? () => onPageSelected(currentPage - 1)
                : null,
            icon: Icon(
              Icons.arrow_back_ios_new,
              size: 15,
              color: currentPage > 0 ? Colors.black : Colors.grey,
            ),
          ),
          Expanded(
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: totalPages,
              padding: EdgeInsets.all(5),
              itemBuilder: (context, index) {
                final isSelected = index == currentPage;
                return GestureDetector(
                  onTap: () => onPageSelected(index),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    padding:  const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color:
                      isSelected ? Colors.blue : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        '${index + 1}',
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.black87,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          IconButton(
            onPressed: currentPage < totalPages - 1
                ? () => onPageSelected(currentPage + 1)
                : null,
            icon: Icon(
              Icons.arrow_forward_ios,
              size: 15,
              color: currentPage < totalPages - 1
                  ? Colors.black
                  : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}
