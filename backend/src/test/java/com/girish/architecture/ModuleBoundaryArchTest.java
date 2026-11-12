package com.girish.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(packages = "com.girish", importOptions = {ImportOption.DoNotIncludeTests.class})
public class ModuleBoundaryArchTest {

    @ArchTest
    static final ArchRule commonMustNotDependOnModules =
            noClasses()
                    .that().resideInAPackage("com.girish.common..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "com.girish.portfolio..",
                            "com.girish.personal..",
                            "com.girish.vault..",
                            "com.girish.registry..",
                            "com.girish.avatar.."
                    );

    @ArchTest
    static final ArchRule noCyclicDependenciesBetweenTopLevelPackages =
            slices().matching("com.girish.(*)..")
                    .should().beFreeOfCycles();
}
