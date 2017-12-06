$scope.generateFiles = function() {
    var result = ['Gene', 'Mutation', 'Tumor', 'Other header needed'];
    // The reason we chose $ as separator is for the benefit of importing console generated txt file to Google sheet
    // Since $ barely exist in the content, when we use it as customized separator, the columns will be able to be formed correctly
    console.log(result.join('$'));
    generateFromSingleGene(0);
};
function generateFromSingleGene(docIndex) {
    if (docIndex < $scope.documents.length) {
        var fileId = $scope.documents[docIndex].id;
        storage.getRealtimeDocument(fileId).then(function(realtime) {
            if (realtime && realtime.error) {
                console.log('did not get realtime document.');
            } else {
                if (docIndex% 50 === 0) {
                    console.log('*********************', docIndex);
                }
                var gene = realtime.getModel().getRoot().get('gene');
                if (gene) {
                    _.each(gene.mutations.asArray(), function(mutation) {
                        var mutationName = mutation.name.text;
                        _.each(mutation.tumors.asArray(), function(tumor) {
                            var tumorName = MainUtils.getCancerTypesName(tumor.cancerTypes);
                            _.each(tumor.TI.asArray(), function(ti) {
                                _.each(ti.treatments.asArray(), function(treatment) {
                                    var result = [gene.name.text, mutationName, tumorName, 'Other value'];
                                    console.log(result.join('$'))
                                });
                            });
                        });
                    });
                } else {
                    console.log('\t\tNo gene model.');
                }
                $timeout(function() {
                    generateFromSingleGene(++docIndex);
                }, 2000, false);
            }
        }, function(error) {
            console.log('Fail to load ', $scope.documents[docIndex].title, error);
            $timeout(function() {
                generateFromSingleGene(++docIndex);
            }, 2000, false);
        });
    } else {
        console.log('finished.');
    }
}
