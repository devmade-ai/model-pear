<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    DECISION_FACTORS,
    QUESTION_ORDER,
    VARIANT_FACTORS,
    MODEL_METADATA,
    getModelRecommendations,
    getVariantRecommendation,
    generateRationale,
    type ModelId,
    type ModelRecommendation,
  } from '$lib/config/wizard';

  const dispatch = createEventDispatcher<{
    select: { modelId: ModelId; variantId?: string };
    skip: void;
  }>();

  // Wizard state
  let answers: Record<string, string> = {};
  let isComplete = false;
  let selectedVariantPreference: string = '';
  let currentQuestionIndex = 0;

  // Derived state
  $: answeredCount = Object.keys(answers).length;
  // QUESTION_ORDER is a const import; once defined, it can't change.
  const totalQuestions = QUESTION_ORDER.length;
  $: progress = Math.round((answeredCount / totalQuestions) * 100);
  $: allAnswered = answeredCount === totalQuestions;
  $: recommendations = answeredCount > 0 ? getModelRecommendations(answers) : [];
  $: topRecommendation = recommendations[0];

  // Current question
  $: currentFactorId = QUESTION_ORDER[currentQuestionIndex];
  $: currentQuestion = DECISION_FACTORS[currentFactorId];
  $: currentAnswer = answers[currentFactorId];
  $: canGoBack = currentQuestionIndex > 0;
  $: canGoNext = currentAnswer !== undefined;
  $: isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  function handleAnswer(factorId: string, value: string) {
    answers = { ...answers, [factorId]: value };
  }

  function handleBack() {
    if (canGoBack) {
      currentQuestionIndex--;
    }
  }

  function handleNext() {
    if (canGoNext && !isLastQuestion) {
      currentQuestionIndex++;
    }
  }

  function goToQuestion(index: number) {
    // Only allow jumping to answered questions or the first unanswered
    const firstUnansweredIndex = QUESTION_ORDER.findIndex((id) => answers[id] === undefined);
    const maxAllowedIndex = firstUnansweredIndex === -1 ? totalQuestions - 1 : firstUnansweredIndex;

    if (index <= maxAllowedIndex) {
      currentQuestionIndex = index;
    }
  }

  function handleSeeResults() {
    isComplete = true;
  }

  function handleRestart() {
    answers = {};
    isComplete = false;
    selectedVariantPreference = '';
    currentQuestionIndex = 0;
  }

  function handleSkip() {
    dispatch('skip');
  }

  function handleUseModel(modelId: ModelId) {
    let variantId: string | undefined;

    if (selectedVariantPreference) {
      const variantRec = getVariantRecommendation(modelId, selectedVariantPreference);
      if (variantRec && variantRec.variants.length > 0) {
        variantId = variantRec.variants[0];
      }
    }

    dispatch('select', { modelId, variantId });
  }

  // Map match-level colour name → DaisyUI badge variant. Used as a
  // soft-coloured pill on the alternative-options row. Caller wraps with
  // `badge badge-soft {variant}` so the base + soft modifier apply
  // alongside the colour variant.
  function getMatchBadgeVariant(color: string) {
    const colorMap: Record<string, string> = {
      green: 'badge-success',
      blue: 'badge-info',
      yellow: 'badge-warning',
      red: 'badge-error',
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<div class="structure-wizard">
  <!-- Header -->
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div>
      <h2 class="text-xl font-semibold text-base-content">Structure Selection Wizard</h2>
      <p class="text-sm text-base-content/70 mt-1">
        {isComplete ? 'Review your recommended transaction structures' : 'Answer questions to find the optimal transaction model'}
      </p>
    </div>
    <div class="flex gap-3">
      {#if !isComplete}
        <button class="btn btn-link btn-sm" on:click={handleSkip}>
          Skip wizard
        </button>
      {/if}
      {#if answeredCount > 0}
        <button class="btn btn-link btn-sm" on:click={handleRestart}>
          Start over
        </button>
      {/if}
    </div>
  </div>

  {#if isComplete && topRecommendation}
    <!-- RESULTS VIEW -->
    <div class="space-y-6">
      <!-- Top Recommendation -->
      <div class="bg-gradient-to-br from-success/10 to-info/10 rounded-lg p-6 border border-success/30">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">{topRecommendation.icon}</span>
          <div>
            <h3 class="text-xl font-semibold text-success">Recommended: {topRecommendation.name}</h3>
            <p class="text-sm text-success/80">
              {topRecommendation.matchLevel.label} ({topRecommendation.normalizedScore}% match)
            </p>
          </div>
        </div>
        <p class="text-base-content/80 mb-4">{topRecommendation.description}</p>

        <!-- Rationale -->
        <div class="card p-4 mb-4 bg-base-200/60">
          <h4 class="text-sm font-medium text-base-content/80 mb-2">Why this model?</h4>
          <div class="text-sm text-base-content/70 whitespace-pre-line">{generateRationale(topRecommendation)}</div>
        </div>

        <!-- Variant Selector -->
        {#if VARIANT_FACTORS[topRecommendation.modelId]}
          <div class="border-t border-base-300 pt-4 mt-4">
            <h4 class="text-sm font-medium text-base-content/80 mb-2">
              {VARIANT_FACTORS[topRecommendation.modelId].question}
            </h4>
            <select
              bind:value={selectedVariantPreference}
              class="select w-full"
            >
              <option value="">Select a variant preference...</option>
              {#each VARIANT_FACTORS[topRecommendation.modelId].factors as factor (factor.value)}
                <option value={factor.value}>{factor.label}</option>
              {/each}
            </select>

            {#if selectedVariantPreference}
              {@const variantRec = getVariantRecommendation(topRecommendation.modelId, selectedVariantPreference)}
              {#if variantRec}
                <div class="alert alert-info alert-soft mt-3" role="status">
                  <p class="text-sm">
                    <span class="font-medium">Recommended variant:</span>
                    {variantRec.variants.join(', ')}
                  </p>
                  <p class="text-xs text-base-content/70 mt-1">
                    <span class="text-base-content/80">Best for:</span>
                    {variantRec.scenario}
                  </p>
                </div>
              {/if}
            {/if}
          </div>
        {/if}

        <button
          class="btn btn-primary w-full mt-4"
          on:click={() => handleUseModel(topRecommendation.modelId)}
        >
          Use {topRecommendation.shortName} →
        </button>
      </div>

      <!-- Alternative Options -->
      <div>
        <h4 class="text-lg font-medium text-base-content mb-4">Alternative Options</h4>
        <div class="space-y-3">
          {#each recommendations.slice(1) as rec (rec.modelId)}
            <div class="card p-4 hover:border-base-300 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xl">{rec.icon}</span>
                  <span class="badge badge-soft badge-sm {getMatchBadgeVariant(rec.matchLevel.color)}">
                    {rec.matchLevel.icon}
                  </span>
                  <h5 class="font-medium text-base-content">{rec.shortName}</h5>
                </div>
                <span class="text-sm text-base-content/70">{rec.normalizedScore}%</span>
              </div>
              <p class="text-sm text-base-content/70 mb-3">{rec.description}</p>

              {#if rec.strengths.length > 0}
                <p class="text-xs text-base-content/70 mb-3">
                  <span class="text-success">✓</span>
                  {rec.strengths.slice(0, 2).map((s) => s.reason).join(', ')}
                </p>
              {/if}

              <button
                class="btn btn-link btn-sm px-0"
                on:click={() => handleUseModel(rec.modelId)}
              >
                Use this model →
              </button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Answer Summary -->
      <div class="card p-4 bg-base-200">
        <h4 class="text-sm font-medium text-base-content/80 mb-3">Your Answers</h4>
        <div class="space-y-2">
          {#each QUESTION_ORDER as factorId (factorId)}
            {@const factor = DECISION_FACTORS[factorId]}
            {@const answer = answers[factorId]}
            {@const option = factor.options.find((o) => o.value === answer)}
            <div class="flex justify-between text-sm">
              <span class="text-base-content/70">{factor.question}</span>
              <span class="text-base-content">{option?.label || 'Not answered'}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- QUESTIONS VIEW -->
    <div class="space-y-6">
      <!-- Progress Indicator -->
      <div>
        <!-- Question Step Indicators -->
        <div class="flex items-center justify-center gap-2 mb-4">
          {#each QUESTION_ORDER as factorId, idx (factorId)}
            {@const isAnswered = answers[factorId] !== undefined}
            {@const isCurrent = idx === currentQuestionIndex}
            {@const isAccessible = idx <= (QUESTION_ORDER.findIndex((id) => answers[id] === undefined) === -1 ? totalQuestions - 1 : QUESTION_ORDER.findIndex((id) => answers[id] === undefined))}
            <button
              class="btn btn-circle btn-xs transition-all tooltip
                     {isCurrent
                ? 'btn-primary ring-2 ring-primary/50'
                : isAnswered
                  ? 'btn-success btn-outline'
                  : 'btn-ghost'}"
              on:click={() => goToQuestion(idx)}
              disabled={!isAccessible}
              data-tip="Question {idx + 1}{isAnswered ? ' (answered)' : ''}"
            >
              {#if isAnswered && !isCurrent}
                ✓
              {:else}
                {idx + 1}
              {/if}
            </button>
          {/each}
        </div>
        <!-- Progress Bar -->
        <div class="flex justify-between text-xs text-base-content/70 mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div class="h-2 bg-base-300 rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" style="width: {((currentQuestionIndex + 1) / totalQuestions) * 100}%"></div>
        </div>
      </div>

      <!-- Current Question -->
      <div class="card p-6 border-2 border-primary/30 bg-primary/5">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-primary font-medium">Question {currentQuestionIndex + 1}</span>
        </div>
        <h3 class="text-lg font-medium text-base-content mb-2">{currentQuestion.question}</h3>
        <p class="text-sm text-base-content/70 mb-4">{currentQuestion.description}</p>

        <div class="space-y-3">
          {#each currentQuestion.options as option (option.value)}
            <label
              class="flex items-start gap-3 p-4 bg-base-200 rounded-lg border-2 cursor-pointer transition-all
                     {currentAnswer === option.value
                ? 'border-primary bg-primary/10'
                : 'border-base-300 hover:border-base-300/80'}"
            >
              <input
                type="radio"
                name="question-{currentFactorId}"
                value={option.value}
                checked={currentAnswer === option.value}
                on:change={() => handleAnswer(currentFactorId, option.value)}
                class="radio radio-primary mt-1"
              />
              <div class="flex-1">
                <span class="font-medium text-base-content">{option.label}</span>
                <p class="text-sm text-base-content/70 mt-1">{option.description}</p>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between pt-4">
        <button
          class="btn btn-ghost btn-sm"
          on:click={handleBack}
          disabled={!canGoBack}
        >
          ← Back
        </button>

        <div class="flex gap-3">
          {#if isLastQuestion && canGoNext}
            <button
              class="btn btn-primary btn-sm"
              on:click={handleSeeResults}
            >
              See Recommendations →
            </button>
          {:else}
            <button
              class="btn btn-primary btn-sm"
              on:click={handleNext}
              disabled={!canGoNext}
            >
              Next →
            </button>
          {/if}
        </div>
      </div>

      <!-- Live Preview -->
      {#if answeredCount > 0}
        <div class="pt-6 border-t border-base-300">
          <h4 class="text-sm font-medium text-base-content/70 mb-3">Current Top Recommendations</h4>
          <div class="flex gap-2 flex-wrap">
            {#each recommendations.slice(0, 3) as rec (rec.modelId)}
              <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-full text-sm">
                <span class="text-lg">{rec.icon}</span>
                <span class="text-base-content/80">{rec.shortName}</span>
                <span class="text-base-content/70">{rec.normalizedScore}%</span>
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
