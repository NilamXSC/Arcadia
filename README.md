# Arcadia Health

AI-powered healthcare assistant ecosystem designed for users in rural and semi-urban India. The system provides educational guidance and triage support while maintaining strict boundaries around medical diagnosis and prescription.

## Overview

Arcadia Health focuses on:
- **Educational guidance** over diagnostic capabilities
- **Cultural sensitivity** and multi-language support
- **Offline-first architecture** for areas with poor connectivity
- **Privacy-by-design** for sensitive health data
- **Safety boundaries** preventing medical advice overreach

## Key Features

### 🏥 Lab Report Interpretation
- Parse and explain lab reports in simple language
- Highlight abnormal values without providing diagnosis
- Support for common Indian healthcare facility formats

### 💓 Vital Signs Analysis
- Analyze blood pressure, heart rate, temperature, oxygen saturation
- Trend analysis for historical data
- Educational context for measurements

### 🚨 Triage Assistant
- Assess symptom urgency (immediate, urgent, routine)
- Emergency situation detection
- Healthcare facility recommendations

### 📚 Educational Content
- Health education in culturally appropriate language
- Prevention and wellness focused content
- No medical advice or treatment recommendations

### 🌍 Cultural Adaptation
- Support for major Indian languages
- Culturally appropriate analogies and examples
- Regional health practice integration

## Architecture

The system follows a modular, three-tier architecture:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  User Interface | Voice | Offline Cache │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│           Application Layer             │
│ Lab Reports | Vital Signs | Triage |    │
│ Education | Cultural Adaptation         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Data Layer                 │
│ NLP Engine | Knowledge Base | Cache |   │
│ Encryption Service                      │
└─────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- TypeScript 5.2.2 or higher

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run property-based tests
npm run test:property

# Start development server
npm run dev
```

### Basic Usage

```typescript
import { createArcadiaHealthSystem } from 'arcadia-health';

// Initialize the system
const system = await createArcadiaHealthSystem();

// Get system status
const status = system.getHealthStatus();
console.log('System initialized:', status.initialized);

// Use encryption service
const encryptionService = system.getEncryptionService();
const encrypted = encryptionService.encrypt('sensitive health data');
const decrypted = encryptionService.decrypt(encrypted);

// Shutdown gracefully
await system.shutdown();
```

## Testing

The project uses a dual testing approach:

### Unit Tests
- Specific examples and edge cases
- Integration points between components
- Error conditions and failure scenarios

### Property-Based Tests
- Universal properties verified across randomized inputs
- Safety boundary enforcement
- Cultural appropriateness validation
- Performance characteristics

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run property-based tests only
npm run test:property

# Watch mode
npm run test:watch
```

## Safety Boundaries

Arcadia Health enforces strict safety boundaries:

- ❌ **No medical diagnosis** - Never provides diagnostic conclusions
- ❌ **No prescriptions** - Never recommends specific medications
- ❌ **No treatment advice** - Never suggests specific treatments
- ✅ **Educational content** - Provides general health information
- ✅ **Triage guidance** - Helps determine when to seek care
- ✅ **Simple explanations** - Makes health data understandable

## Cultural Sensitivity

The system adapts to diverse cultural contexts:

- **Language Support**: Hindi, English, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Odia
- **Cultural Examples**: Uses locally relevant analogies and references
- **Communication Style**: Adapts formality and approach based on user profile
- **Local Practices**: Integrates understanding of traditional health practices

## Privacy & Security

- **AES-256 Encryption** for all health data
- **Automatic data retention** policies
- **User consent management** with granular controls
- **Audit logging** for compliance
- **Minimal data collection** principle

## Development

### Project Structure

```
src/
├── types/              # Core type definitions
├── interfaces/         # Component interfaces
├── services/          # Core services (encryption, etc.)
├── test/              # Test utilities and generators
└── index.ts           # Main entry point
```

### Adding New Components

1. Define interfaces in `src/interfaces/`
2. Add types to `src/types/index.ts`
3. Implement services in `src/services/`
4. Add property-based tests
5. Update documentation

### Property-Based Testing

Tests use fast-check for property-based testing:

```typescript
import * as fc from 'fast-check';
import { userProfileGen, healthMetricGen } from './test/generators';

test('Property: User profiles are valid', () => {
  fc.assert(fc.property(
    userProfileGen,
    (profile) => {
      expect(profile.id).toBeDefined();
      expect(profile.culturalContext).toBeDefined();
    }
  ));
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub.

---

**Arcadia Health v1.0.0** - Empowering health literacy in rural and semi-urban India through AI-powered assistance while maintaining strict safety boundaries and cultural sensitivity.