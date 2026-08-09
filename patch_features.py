import os
import re

print("Starting Phase 2 & 3...")

page_tsx_path = "a:/Projects/mission_vardi_app/mock_test_portal/src/app/page.tsx"
if os.path.exists(page_tsx_path):
    with open(page_tsx_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Define the toggle
    if "const ENABLE_FITNESS_TRACKER" not in content:
        content = content.replace(
            "const [activeTab, setActiveTab]",
            "const ENABLE_FITNESS_TRACKER = process.env.NEXT_PUBLIC_ENABLE_FITNESS_TRACKER === 'true';\n  const [activeTab, setActiveTab]"
        )

    # Hide the tabs based on the toggle
    content = content.replace(
        """<TabButton active={activeTab === "physical-test"} onClick={() => setActiveTab("physical-test")} icon={<span style={{ fontSize: "1.2rem" }}>🏃</span>} text="Fitness Guide" />""",
        """{ENABLE_FITNESS_TRACKER && <TabButton active={activeTab === "physical-test"} onClick={() => setActiveTab("physical-test")} icon={<span style={{ fontSize: "1.2rem" }}>🏃</span>} text="Fitness Guide" />}"""
    )

    with open(page_tsx_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched Web Portal.")

# Update Web .env
web_env = "a:/Projects/mission_vardi_app/mock_test_portal/.env"
if os.path.exists(web_env):
    with open(web_env, "a", encoding="utf-8") as f:
        f.write("\n# CodeCanyon Feature Toggles\nNEXT_PUBLIC_ENABLE_FITNESS_TRACKER=false\n")
    print("Patched Web .env")

# Update App .env
app_env = "a:/Projects/mission_vardi_app/.env"
if os.path.exists(app_env):
    with open(app_env, "a", encoding="utf-8") as f:
        f.write("\nENABLE_FITNESS_TRACKER=false\n")
    print("Patched App .env")

print("Phase 2 & 3 Completed via Python script.")
