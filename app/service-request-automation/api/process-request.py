#!/usr/bin/env python3
"""
Service Request Automation API Endpoint
Demonstrates how RenewalEngineAI processes service requests for insurance agencies
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum

class RequestType(Enum):
    ENDORSEMENT = "endorsement"
    CERTIFICATE = "certificate_of_insurance"
    BILLING = "billing_question"
    CLAIM = "claim_related"
    POLICY_CHANGE = "policy_change"
    GENERAL_INQUIRY = "general_inquiry"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class ServiceRequestProcessor:
    def __init__(self):
        # Classification keywords for different request types
        self.classification_keywords = {
            RequestType.ENDORSEMENT: [
                'endorse', 'endorsement', 'add driver', 'remove driver', 
                'add vehicle', 'remove vehicle', 'change coverage', 
                'update policy', 'lienholder', 'loss payable'
            ],
            RequestType.CERTIFICATE: [
                'certificate', 'cert of insurance', 'coi', 'proof of insurance',
                'verification of coverage', 'certificate holder'
            ],
            RequestType.BILLING: [
                'bill', 'billing', 'payment', 'premium', 'invoice', 
                'late fee', 'payment plan', 'autopay', 'declined payment'
            ],
            RequestType.CLAIM: [
                'claim', 'accident', 'damage', 'loss', 'theft', 
                'vandalism', 'weather damage', 'fire', 'collision'
            ],
            RequestType.POLICY_CHANGE: [
                'cancel', 'non-renew', 'renewal', 'change effective date',
                'change payment plan', 'update mailing address'
            ]
        }
        
        # Priority indicators
        self.priority_indicators = {
            Priority.URGENT: ['urgent', 'emergency', 'asap', 'immediately', 'right now', 'cancellation', 'lapse'],
            Priority.HIGH: ['soon', 'today', 'tomorrow', 'deadline', 'expiring'],
            Priority.MEDIUM: ['when you can', 'no rush', 'standard'],
            Priority.LOW: ['whenever', 'no hurry', 'low priority']
        }
    
    def classify_request(self, text: str) -> RequestType:
        """Classify the service request based on content"""
        text_lower = text.lower()
        scores = {request_type: 0 for request_type in RequestType}
        
        # Score each request type based on keyword matches
        for request_type, keywords in self.classification_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    scores[request_type] += 1
        
        # Return the request type with the highest score
        # Default to general inquiry if no clear match
        if max(scores.values()) == 0:
            return RequestType.GENERAL_INQUIRY
        
        return max(scores, key=scores.get)
    
    def determine_priority(self, text: str) -> Priority:
        """Determine request priority based on urgency indicators"""
        text_lower = text.lower()
        
        # Check for priority indicators in descending order of urgency
        for priority, indicators in self.priority_indicators.items():
            for indicator in indicators:
                if indicator in text_lower:
                    return priority
        
        # Default to medium priority
        return Priority.MEDIUM
    
    def extract_entities(self, text: str) -> Dict[str, Optional[str]]:
        """Extract key entities from the request text"""
        entities = {
            'policy_number': None,
            'claim_number': None,
            'driver_name': None,
            'vehicle_info': None,
            'date_of_incident': None,
            'amount': None
        }
        
        # Simple regex patterns for common entities (in practice, these would be more sophisticated)
        policy_match = re.search(r'policy\s*#?\s*([A-Z0-9]{6,12})', text, re.IGNORECASE)
        if policy_match:
            entities['policy_number'] = policy_match.group(1)
        
        claim_match = re.search(r'claim\s*#?\s*([A-Z0-9]{6,12})', text, re.IGNORECASE)
        if claim_match:
            entities['claim_number'] = claim_match.group(1)
        
        amount_match = re.search(r'\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
        if amount_match:
            entities['amount'] = amount_match.group(1)
        
        return entities
    
    def process_request(self, client_message: str, client_info: Dict = None) -> Dict:
        """
        Process an incoming service request and return automation actions
        
        Args:
            client_message: The raw message from the client
            client_info: Optional client context (policy info, history, etc.)
            
        Returns:
            Dictionary containing classification, routing, and automation actions
        """
        # Classify the request
        request_type = self.classify_request(client_message)
        
        # Determine priority
        priority = self.determine_priority(client_message)
        
        # Extract entities
        entities = self.extract_entities(client_message)
        
        # Generate suggested response
        suggested_response = self.generate_suggested_response(request_type, priority, entities)
        
        # Determine routing (simplified - in practice would consider agent skills, workload, etc.)
        routing_suggestion = self.determine_routing(request_type, priority)
        
        # Generate automation actions
        automation_actions = self.generate_automation_actions(request_type, priority, entities)
        
        return {
            'request_id': self.generate_request_id(),
            'timestamp': datetime.now().isoformat(),
            'classification': {
                'type': request_type.value,
                'priority': priority.value,
                'confidence': 0.85  # In practice, this would be a real confidence score
            },
            'entities': entities,
            'suggested_response': suggested_response,
            'routing': routing_suggestion,
            'automation_actions': automation_actions,
            'estimated_processing_time': self.estimate_processing_time(request_type),
            'sla_deadline': self.calculate_sla_deadline(priority)
        }
    
    def generate_request_id(self) -> str:
        """Generate a unique request ID"""
        import uuid
        return f"SR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    def generate_suggested_response(self, request_type: RequestType, priority: Priority, entities: Dict) -> str:
        """Generate a suggested response for the service agent"""
        policy_info = f"Policy #: {entities['policy_number']}" if entities['policy_number'] else ""
        claim_info = f"Claim #: {entities['claim_number']}" if entities['claim_number'] else ""
        
        base_response = f"Thank you for contacting us. I've received your {request_type.value.replace('_', ' ')} request."
        
        if policy_info:
            base_response += f" {policy_info}"
        if claim_info:
            base_response += f" {claim_info}"
        
        base_response += ". "
        
        if priority == Priority.URGENT:
            base_response += "This has been flagged as urgent and will be addressed immediately."
        elif priority == Priority.HIGH:
            base_response += "This has been prioritized for same-day attention."
        else:
            base_response += "Our team will review this and get back to you within our standard response time."
        
        base_response += " Is there anything else I can help you with today?"
        
        return base_response
    
    def determine_routing(self, request_type: RequestType, priority: Priority) -> Dict:
        """Determine how to route the request (simplified)"""
        # In a real system, this would consider:
        # - Agent skills and certifications
        # - Current workload and availability
        # - Geographic considerations
        # - Language preferences
        # - Specialized expertise
        
        routing_map = {
            RequestType.ENDORSEMENT: "Endorsements Specialist Team",
            RequestType.CERTIFICATE: "Certificates Processing Unit",
            RequestType.BILLING: "Billing & Payments Department",
            RequestType.CLAIM: "Claims Intake Team",
            RequestType.POLICY_CHANGE: "Policy Services Team",
            RequestType.GENERAL_INQUIRY: "General Inquiries Desk"
        }
        
        base_team = routing_map.get(request_type, "General Service Team")
        
        # Add priority indicator if urgent/high
        if priority in [Priority.URGENT, Priority.HIGH]:
            return {
                'team': base_team,
                'priority_flag': f"{priority.value.upper()} PRIORITY",
                'suggested_response_time': 'Immediate' if priority == Priority.URGENT else 'Same Day'
            }
        
        return {
            'team': base_team,
            'priority_flag': 'STANDARD',
            'suggested_response_time': 'Within 24 Hours'
        }
    
    def generate_automation_actions(self, request_type: RequestType, priority: Priority, entities: Dict) -> List[Dict]:
        """Generate the automation actions to be performed"""
        actions = []
        
        # Always log the request
        actions.append({
            'action': 'log_request',
            'description': 'Log service request in system for tracking and analytics',
            'automated': True
        })
        
        # Send acknowledgment to client
        actions.append({
            'action': 'send_acknowledgment',
            'description': 'Send automated acknowledgment with expected response time',
            'automated': True,
            'template': 'service_acknowledgment'
        })
        
        # Extract and populate data if entities found
        if entities['policy_number']:
            actions.append({
                'action': 'populate_policy_data',
                'description': 'Auto-populate policy information from request',
                'automated': True
            })
        
        # Create task in task management system
        actions.append({
            'action': 'create_service_task',
            'description': 'Create service request task in workflow system',
            'automated': True
        })
        
        # Set up follow-up reminders based on priority
        if priority == Priority.URGENT:
            actions.append({
                'action': 'set_immediate_alert',
                'description': 'Set immediate alert for urgent requests',
                'automated': True
            })
        elif priority == Priority.HIGH:
            actions.append({
                'action': 'set_followup_reminder',
                'description': 'Set 2-hour follow-up reminder for high priority',
                'automated': True,
                'delay_minutes': 120
            })
        else:
            actions.append({
                'action': 'set_standard_followup',
                'description': 'Set 24-hour follow-up reminder',
                'automated': True,
                'delay_minutes': 1440
            })
        
        # Extract data from attachments if present (would be triggered by file upload)
        actions.append({
            'action': 'process_attachments',
            'description': 'Extract data from attached documents (PDFs, images)',
            'automated': True,
            'conditional': True  # Only runs if attachments are present
        })
        
        return actions
    
    def estimate_processing_time(self, request_type: RequestType) -> Dict:
        """Estimate processing time based on request type"""
        base_times = {
            RequestType.ENDORSEMENT: {'min': 15, 'max': 45, 'unit': 'minutes'},
            RequestType.CERTIFICATE: {'min': 5, 'max': 15, 'unit': 'minutes'},
            RequestType.BILLING: {'min': 10, 'max': 30, 'unit': 'minutes'},
            RequestType.CLAIM: {'min': 30, 'max': 120, 'unit': 'minutes'},
            RequestType.POLICY_CHANGE: {'min': 20, 'max': 60, 'unit': 'minutes'},
            RequestType.GENERAL_INQUIRY: {'min': 5, 'max': 20, 'unit': 'minutes'}
        }
        
        return base_times.get(request_type, {'min': 10, 'max': 30, 'unit': 'minutes'})
    
    def calculate_sla_deadline(self, priority: Priority) -> str:
        """Calculate SLA deadline based on priority"""
        now = datetime.now()
        
        sla_map = {
            Priority.URGENT: timedelta(hours=1),
            Priority.HIGH: timedelta(hours=4),
            Priority.MEDIUM: timedelta(hours=24),
            Priority.LOW: timedelta(hours=48)
        }
        
        deadline = now + sla_map.get(priority, timedelta(hours=24))
        return deadline.isoformat()

# Example usage
if __name__ == "__main__":
    processor = ServiceRequestProcessor()
    
    # Example requests to test
    test_requests = [
        "I need to add my new teenage driver to my policy ASAP - policy #POL123456789",
        "Can you send me a certificate of insurance for my landscaping business? Need it today for a contract.",
        "I was charged twice for my premium this month. Can you look into this?",
        "I got into a fender bender yesterday. Need to start a claim. Police report #12345.",
        "I want to change my payment plan from monthly to quarterly.",
        "Just wondering what my deductible is for comprehensive coverage."
    ]
    
    print("Service Request Automation Demo")
    print("=" * 50)
    
    for i, request in enumerate(test_requests, 1):
        print(f"\nRequest {i}: {request}")
        result = processor.process_request(request)
        
        print(f"  Type: {result['classification']['type']} ({result['classification']['priority']} priority)")
        print(f"  Policy: {result['entities']['policy_number'] or 'Not found'}")
        print(f"  Suggested Response: {result['suggested_response']}")
        print(f"  Routing: {result['routing']['team']} - {result['routing']['suggested_response_time']}")
        print(f"  Estimated Time: {result['estimated_processing_time']['min']}-{result['estimated_processing_time']['max']} {result['estimated_processing_time']['unit']}")