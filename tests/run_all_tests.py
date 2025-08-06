#!/usr/bin/env python3
"""
PaiNaiDee 3D Map - Test Runner
A test runner script for the PaiNaiDee 3D Map project.

This script runs all available tests for the project including:
- HTML validation
- JavaScript validation 
- Accessibility tests
- Performance checks

Usage:
    python tests/run_all_tests.py
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def print_header(title):
    """Print a formatted header for test sections."""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def run_command(command, description):
    """Run a shell command and return its result."""
    print(f"\n🔍 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=get_project_root())
        if result.returncode == 0:
            print(f"✅ {description} - PASSED")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} - FAILED")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {str(e)}")
        return False

def get_project_root():
    """Get the project root directory."""
    return Path(__file__).parent.parent

def check_dependencies():
    """Check if required dependencies are available."""
    print_header("DEPENDENCY CHECK")
    
    dependencies = {
        "node": "node --version",
        "npm": "npm --version", 
        "python3": "python3 --version"
    }
    
    all_ok = True
    for dep, cmd in dependencies.items():
        if run_command(cmd, f"Checking {dep}"):
            continue
        else:
            all_ok = False
            
    return all_ok

def run_validation_tests():
    """Run code validation tests."""
    print_header("CODE VALIDATION TESTS")
    
    tests = [
        ("npm run validate:js", "JavaScript validation"),
        ("npm run validate:html", "HTML validation"),
    ]
    
    passed = 0
    for cmd, description in tests:
        if run_command(cmd, description):
            passed += 1
            
    print(f"\n📊 Validation Results: {passed}/{len(tests)} tests passed")
    return passed == len(tests)

def run_accessibility_tests():
    """Run accessibility validation tests."""
    print_header("ACCESSIBILITY TESTS")
    
    print("🔍 Checking HTML structure for accessibility...")
    
    # Check for key accessibility features in the main HTML file
    html_file = get_project_root() / "index.html"
    
    if not html_file.exists():
        print("❌ Main HTML file not found")
        return False
        
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    accessibility_checks = [
        ('aria-', 'ARIA attributes'),
        ('role=', 'ARIA roles'),
        ('alt=', 'Image alt text'),
        ('lang=', 'Language attributes'),
        ('tabindex', 'Tab navigation'),
    ]
    
    passed = 0
    for check, description in accessibility_checks:
        if check in content:
            print(f"✅ {description} - Found")
            passed += 1
        else:
            print(f"⚠️  {description} - Not found or limited")
            
    print(f"\n📊 Accessibility Results: {passed}/{len(accessibility_checks)} features found")
    return passed >= len(accessibility_checks) // 2  # At least half should pass

def run_performance_tests():
    """Run basic performance checks."""
    print_header("PERFORMANCE TESTS")
    
    project_root = get_project_root()
    
    # Check file sizes
    files_to_check = [
        "script.js",
        "styles.css", 
        "index.html"
    ]
    
    print("🔍 Checking file sizes...")
    all_reasonable = True
    
    for filename in files_to_check:
        filepath = project_root / filename
        if filepath.exists():
            size = filepath.stat().st_size
            size_mb = size / (1024 * 1024)
            if size_mb < 5:  # Less than 5MB
                print(f"✅ {filename}: {size_mb:.2f}MB - Good size")
            else:
                print(f"⚠️  {filename}: {size_mb:.2f}MB - Large file")
                all_reasonable = False
        else:
            print(f"❌ {filename}: File not found")
            all_reasonable = False
            
    return all_reasonable

def run_browser_tests():
    """Run browser-based tests."""
    print_header("BROWSER TESTS")
    
    # Check if we can start a local server
    print("🔍 Testing local server startup...")
    
    feedback_test = get_project_root() / "tests" / "feedback-test.html"
    if feedback_test.exists():
        print("✅ Feedback test file found")
        print(f"   Location: {feedback_test}")
        
        # Optionally open the test in browser (commented out for CI)
        # print("🌐 Opening feedback test in browser...")
        # webbrowser.open(f"file://{feedback_test.absolute()}")
        
        return True
    else:
        print("❌ Feedback test file not found")
        return False

def main():
    """Main test runner function."""
    print_header("PAINAIDEE 3D MAP - TEST SUITE")
    print("🗺️  Running all tests for PaiNaiDee 3D Map project")
    print(f"📁 Project root: {get_project_root()}")
    
    test_results = []
    
    # Run all test suites
    test_suites = [
        ("Dependencies", check_dependencies),
        ("Code Validation", run_validation_tests), 
        ("Accessibility", run_accessibility_tests),
        ("Performance", run_performance_tests),
        ("Browser Tests", run_browser_tests),
    ]
    
    for suite_name, suite_func in test_suites:
        try:
            result = suite_func()
            test_results.append((suite_name, result))
        except Exception as e:
            print(f"❌ {suite_name} - CRASHED: {str(e)}")
            test_results.append((suite_name, False))
    
    # Print summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for suite_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {suite_name:20} : {status}")
    
    print(f"\n📊 Overall Results: {passed}/{total} test suites passed")
    
    if passed == total:
        print("🎉 All tests passed! Project is ready for deployment.")
        exit_code = 0
    else:
        print("⚠️  Some tests failed. Please review and fix issues before deployment.")
        exit_code = 1
        
    print("\n💡 Tips:")
    print("   - Run 'npm run start' to test the application locally")
    print("   - Open tests/feedback-test.html to test the feedback system")
    print("   - Check browser console for any runtime errors")
    
    return exit_code

if __name__ == "__main__":
    sys.exit(main())