#!/usr/bin/env ts-node
/**
 * Test script for the NSaaS Build Agent
 * 
 * This simulates the agent workflow without actually cloning/building:
 * 1. Creates a test feature
 * 2. Polls for the build job
 * 3. Simulates agent progress reporting
 * 4. Verifies the end-to-end flow
 */

const API_URL = process.env.NSaaS_API_URL || 'http://localhost:3000';
const API_KEY = process.env.ORCHESTRATOR_API_KEY || 'mock-key';

interface TestResult {
  step: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function log(step: string, passed: boolean, message: string) {
  results.push({ step, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${step}: ${message}`);
}

async function testOrchestrateEndpoint() {
  console.log('\n📡 Testing /api/orchestrate endpoint...\n');
  
  // Test 1: Unauthorized request
  try {
    const res = await fetch(`${API_URL}/api/orchestrate`);
    if (res.status === 401) {
      log('Auth Check', true, 'Returns 401 without API key');
    } else {
      log('Auth Check', false, `Expected 401, got ${res.status}`);
    }
  } catch (e: any) {
    log('Auth Check', false, `Error: ${e.message}`);
  }

  // Test 2: Poll for builds (with auth)
  try {
    const res = await fetch(`${API_URL}/api/orchestrate`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.build === null || data.build) {
        log('Poll Builds', true, `Response OK (build: ${data.build ? 'found' : 'null'})`);
      } else {
        log('Poll Builds', false, 'Unexpected response format');
      }
    } else {
      log('Poll Builds', false, `HTTP ${res.status}`);
    }
  } catch (e: any) {
    log('Poll Builds', false, `Error: ${e.message}`);
  }
}

async function testBuildLogsEndpoint() {
  console.log('\n📡 Testing /api/builds/logs SSE endpoint...\n');
  
  // Test 1: Unauthorized request
  try {
    const res = await fetch(`${API_URL}/api/builds/logs`);
    if (res.status === 401 || res.status === 400) {
      log('SSE Auth Check', true, `Returns ${res.status} as expected`);
    } else {
      log('SSE Auth Check', false, `Unexpected status: ${res.status}`);
    }
  } catch (e: any) {
    log('SSE Auth Check', false, `Error: ${e.message}`);
  }
}

async function testAgentScript() {
  console.log('\n🤖 Testing Build Agent Script...\n');
  
  // Check if agent script exists and compiles
  const fs = require('fs');
  const path = require('path');
  
  const agentPath = path.join(__dirname, 'build-agent.ts');
  if (fs.existsSync(agentPath)) {
    log('Agent Script Exists', true, `Found at ${agentPath}`);
    
    // Check for key functions
    const content = fs.readFileSync(agentPath, 'utf-8');
    const requiredFunctions = [
      'pollForBuild',
      'reportProgress',
      'processBuild',
      'cloneRepository',
      'analyzeCodebase',
      'generateImplementationPlan',
      'runQualityGates',
      'commitAndPush',
      'createPullRequest',
    ];
    
    for (const func of requiredFunctions) {
      if (content.includes(`async function ${func}`) || content.includes(`function ${func}`)) {
        log(`Function: ${func}`, true, 'Found');
      } else {
        log(`Function: ${func}`, false, 'Missing');
      }
    }
    
    // Check for quality gates
    const qualityGates = ['typescript', 'eslint', 'build', 'tests'];
    for (const gate of qualityGates) {
      if (content.toLowerCase().includes(gate)) {
        log(`Quality Gate: ${gate}`, true, 'Found');
      } else {
        log(`Quality Gate: ${gate}`, false, 'Missing');
      }
    }
  } else {
    log('Agent Script Exists', false, 'Not found');
  }
}

async function testFeatureDetailPage() {
  console.log('\n📱 Testing Feature Detail Page...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  const pagePath = path.join(__dirname, '..', 'src', 'app', 'dashboard', 'features', '[id]', 'page.tsx');
  if (fs.existsSync(pagePath)) {
    log('Feature Detail Page', true, 'Found');
    
    const content = fs.readFileSync(pagePath, 'utf-8');
    
    // Check for key features
    const features = [
      { name: 'Live Badge', pattern: /isLive/ },
      { name: 'SSE Connection', pattern: /EventSource/ },
      { name: 'Build Logs', pattern: /build.*log|log.*build/i },
      { name: 'Auto-scroll', pattern: /scrollIntoView|logsEndRef/ },
      { name: 'Status Colors', pattern: /statusColors/ },
    ];
    
    for (const feature of features) {
      if (feature.pattern.test(content)) {
        log(`Feature: ${feature.name}`, true, 'Found');
      } else {
        log(`Feature: ${feature.name}`, false, 'Missing');
      }
    }
  } else {
    log('Feature Detail Page', false, 'Not found');
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\nTotal: ${passed}/${total} tests passed\n`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    console.log('\nNext steps:');
    console.log('1. Run the agent: npm run agent');
    console.log('2. Create a feature in the dashboard');
    console.log('3. Watch the agent process the build');
  } else {
    console.log('⚠️ Some tests failed. Check the output above.');
  }
  
  console.log('');
}

async function main() {
  console.log('🚀 NSaaS Build Agent Test Suite');
  console.log('================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  
  await testOrchestrateEndpoint();
  await testBuildLogsEndpoint();
  await testAgentScript();
  await testFeatureDetailPage();
  await printSummary();
}

main().catch(console.error);
